'use strict'

/**
 * End-to-end authorization checks. Run from server/: `npm test`
 *
 * - No DB: student isolation + upload auth + student POST attendance (403).
 * - With DATABASE_URL + data: admin/teacher write paths (not 403).
 */

const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

process.env.NODE_ENV = 'test'
if (!String(process.env.JWT_SECRET || '').trim()) {
  process.env.JWT_SECRET = 'security-test-jwt-secret-do-not-use-in-prod'
}

const { describe, test, before } = require('node:test')
const assert = require('node:assert/strict')
const jwt = require('jsonwebtoken')
const request = require('supertest')

const app = require('../app')
const {
  assertOwnStudentOrElevated,
  resolveListStudentScope,
} = require('../lib/studentAccessGuard')
const { requireTeacherOrAdmin } = require('../middleware/requireTeacherOrAdmin')

const secret = process.env.JWT_SECRET

function bearer(payload) {
  const token = jwt.sign(
    { id: payload.id ?? 1, ...payload },
    secret,
    { expiresIn: '1h' },
  )
  return `Bearer ${token}`
}

describe('studentAccessGuard (unit)', () => {
  test('student cannot access another student id', () => {
    const req = { user: { id: 5, role: 'student', student_id: 10 } }
    assert.throws(
      () => assertOwnStudentOrElevated(req, 11),
      (e) => e.status === 403 && e.message === 'Forbidden',
    )
  })

  test('student can access linked student id', () => {
    const req = { user: { id: 5, role: 'student', student_id: 10 } }
    assertOwnStudentOrElevated(req, 10)
  })

  test('parent uses same rules as student', () => {
    const req = { user: { id: 5, role: 'parent', student_id: 3 } }
    assert.throws(
      () => assertOwnStudentOrElevated(req, 99),
      (e) => e.status === 403,
    )
    assertOwnStudentOrElevated(req, 3)
  })

  test('admin bypasses student check', () => {
    const req = { user: { id: 1, role: 'admin' } }
    assertOwnStudentOrElevated(req, 99999)
  })

  test('teacher bypasses student check', () => {
    const req = { user: { id: 2, role: 'teacher' } }
    assertOwnStudentOrElevated(req, 99999)
  })

  test('resolveListStudentScope: student with mismatched query student_id throws', () => {
    const req = { user: { role: 'student', student_id: 7 } }
    assert.throws(
      () => resolveListStudentScope(req, '8'),
      (e) => e.status === 403,
    )
  })

  test('resolveListStudentScope: student matching query returns id', () => {
    const req = { user: { role: 'student', student_id: 7 } }
    assert.equal(resolveListStudentScope(req, '7'), 7)
  })

  test('resolveListStudentScope: teacher can omit filter', () => {
    const req = { user: { role: 'teacher' } }
    assert.equal(resolveListStudentScope(req, ''), undefined)
  })
})

describe('requireTeacherOrAdmin (unit)', () => {
  test('student gets 403 and body.error', () => {
    const req = { user: { role: 'student', id: 1 } }
    const res = {
      statusCode: 0,
      body: null,
      status(n) {
        this.statusCode = n
        return this
      },
      json(o) {
        this.body = o
        return this
      },
    }
    let nextCalled = false
    requireTeacherOrAdmin(req, res, () => {
      nextCalled = true
    })
    assert.equal(nextCalled, false)
    assert.equal(res.statusCode, 403)
    assert.equal(res.body.error, 'Unauthorized')
  })

  test('teacher proceeds', () => {
    const req = { user: { role: 'teacher' } }
    const res = {}
    let nextCalled = false
    requireTeacherOrAdmin(req, res, () => {
      nextCalled = true
    })
    assert.equal(nextCalled, true)
  })

  test('admin proceeds', () => {
    const req = { user: { role: 'admin' } }
    const res = {}
    let nextCalled = false
    requireTeacherOrAdmin(req, res, () => {
      nextCalled = true
    })
    assert.equal(nextCalled, true)
  })
})

describe('HTTP: student isolation & writes', () => {
  test('1. Student GET another student id → 403', async () => {
    const res = await request(app)
      .get('/api/students/99999')
      .set('Authorization', bearer({ role: 'student', student_id: 1, id: 10 }))
    assert.equal(res.status, 403)
    assert.equal(res.body.success, false)
    assert.equal(res.body.error, 'Forbidden')
  })

  test('1b. Student GET attendance scoped to another student_id → 403', async () => {
    const res = await request(app)
      .get('/api/attendance?student_id=999')
      .set('Authorization', bearer({ role: 'student', student_id: 1, id: 10 }))
    assert.equal(res.status, 403)
    assert.equal(res.body.error, 'Forbidden')
  })

  test('2. Student POST attendance → 403 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/attendance')
      .set('Authorization', bearer({ role: 'student', student_id: 1, id: 10 }))
      .set('Content-Type', 'application/json')
      .send({
        studentId: 1,
        date: '2026-04-01',
        status: 'present',
      })
    assert.equal(res.status, 403)
    assert.equal(res.body.error, 'Unauthorized')
  })

  test('2b. Student POST performance → 403 (same guard as attendance)', async () => {
    const res = await request(app)
      .post('/api/performance')
      .set('Authorization', bearer({ role: 'student', student_id: 1, id: 10 }))
      .set('Content-Type', 'application/json')
      .send({
        studentId: 1,
        score: 'A',
        remarks: 'test',
      })
    assert.equal(res.status, 403)
    assert.equal(res.body.error, 'Unauthorized')
  })

  test('5. GET /api/uploads without auth → 401', async () => {
    const res = await request(app).get('/api/uploads/gallery/does-not-exist.jpg')
    assert.equal(res.status, 401)
    assert.equal(res.body.success, false)
  })
})

describe('HTTP: admin & teacher (needs DATABASE_URL)', () => {
  let studentId = null

  before(async () => {
    if (!process.env.DATABASE_URL) return
    try {
      const pool = require('../config/db')
      const { rows } = await pool.query('SELECT id FROM students ORDER BY id LIMIT 1')
      studentId = rows[0]?.id ?? null
    } catch {
      studentId = null
    }
  })

  test('3. Admin GET arbitrary student id → not forbidden (200 or 404)', async (t) => {
    if (!process.env.DATABASE_URL) {
      t.skip('DATABASE_URL not set')
      return
    }
    const res = await request(app)
      .get('/api/students/999999')
      .set('Authorization', bearer({ role: 'admin', id: 1 }))
    assert.ok(res.status !== 403, `expected not 403, got ${res.status}`)
    assert.ok([200, 404].includes(res.status), `expected 200 or 404, got ${res.status}`)
  })

  test('4. Teacher POST attendance → 201 when student exists', async (t) => {
    if (!process.env.DATABASE_URL) {
      t.skip('DATABASE_URL not set')
      return
    }
    if (!studentId) {
      t.skip('no rows in students table')
      return
    }
    const date = '2099-06-15'
    const res = await request(app)
      .post('/api/attendance')
      .set('Authorization', bearer({ role: 'teacher', id: 2 }))
      .set('Content-Type', 'application/json')
      .send({
        studentId,
        date,
        status: 'present',
      })
    assert.notEqual(res.status, 403, `unexpected 403: ${JSON.stringify(res.body)}`)
    assert.equal(res.status, 201)
    assert.equal(res.body.success, true)
    assert.equal(res.body.data.student_id, studentId)
  })
})
