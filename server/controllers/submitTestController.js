const { syncTests } = require('../lib/syncTests')
const { normalizeSlug } = require('../lib/slug')
const testRegistryModel = require('../models/testRegistryModel')

async function resolveTest(inputSlug) {
  const slug = normalizeSlug(inputSlug)
  if (!slug) {
    return { slug: null, test: null }
  }

  await syncTests()
  let test = await testRegistryModel.findBySlug(slug)
  if (!test) {
    await syncTests()
    test = await testRegistryModel.findBySlug(slug)
  }
  return { slug, test }
}

/**
 * POST /api/submit-test
 * Body: { testSlug | slug, payload?: object, ... } — extra fields echoed in response
 */
async function submitTest(req, res) {
  const raw = req.body.testSlug ?? req.body.slug ?? ''
  const { slug, test } = await resolveTest(raw)

  if (!slug) {
    const err = new Error('testSlug (or slug) is required')
    err.status = 400
    throw err
  }

  if (!test) {
    const err = new Error(`Unknown test slug after registry sync: "${slug}"`)
    err.status = 400
    throw err
  }

  const payload =
    req.body.payload != null
      ? req.body.payload
      : (() => {
          const rest = { ...req.body }
          delete rest.testSlug
          delete rest.slug
          return rest
        })()

  res.json({
    success: true,
    data: {
      test: { id: test.id, name: test.name, slug: test.slug },
      received: payload,
    },
  })
}

module.exports = { submitTest, resolveTest }
