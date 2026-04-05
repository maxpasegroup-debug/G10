const fs = require('fs')
const path = require('path')

const UPLOADS_ROOT = path.join(__dirname, '..', 'uploads')

/**
 * GET (and HEAD) under /api/uploads/* — requires verifyToken upstream.
 * Path is relative to the uploads directory; blocks path traversal.
 */
function serve(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const rawPath = (req.originalUrl || '').split('?')[0]
  const prefix = '/api/uploads/'
  if (!rawPath.startsWith(prefix)) {
    return res.status(404).json({ success: false, error: 'Not found' })
  }

  let rel = rawPath.slice(prefix.length)
  try {
    rel = decodeURIComponent(rel)
  } catch {
    return res.status(400).json({ success: false, error: 'Invalid path' })
  }

  if (!rel || rel.includes('..')) {
    return res.status(400).json({ success: false, error: 'Invalid path' })
  }

  const resolvedRoot = path.resolve(UPLOADS_ROOT)
  const abs = path.resolve(path.join(UPLOADS_ROOT, rel))
  if (!abs.startsWith(resolvedRoot + path.sep) && abs !== resolvedRoot) {
    return res.status(403).json({ success: false, error: 'Forbidden' })
  }

  fs.stat(abs, (err, st) => {
    if (err || !st.isFile()) {
      return res.status(404).json({ success: false, error: 'Not found' })
    }
    if (req.method === 'HEAD') {
      return res.status(204).end()
    }
    res.sendFile(abs, (sendErr) => {
      if (sendErr && !res.headersSent) {
        res.status(500).json({ success: false, error: 'Could not send file' })
      }
    })
  })
}

module.exports = { serve, UPLOADS_ROOT }
