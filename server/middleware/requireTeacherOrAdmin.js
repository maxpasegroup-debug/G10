function requireTeacherOrAdmin(req, res, next) {
  const r = String(req.user?.role || '').toLowerCase()
  if (r !== 'admin' && r !== 'teacher') {
    return res.status(403).json({ error: 'Unauthorized' })
  }
  next()
}

module.exports = { requireTeacherOrAdmin }
