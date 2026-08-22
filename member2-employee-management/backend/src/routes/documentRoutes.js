const express = require('express');
const router = express.Router({ mergeParams: true }); // Important for receiving employeeId from app.js if mounted differently, though here we mount directly in app
const documentController = require('../controllers/documentController');
const { auth, requireAdmin } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { uploadDocumentSchema } = require('../validators/documentValidator');
const upload = require('../middleware/upload');

router.use(auth);

// Base route is usually /api/documents but for employee documents it can be /api/employees/:employeeId/documents
// For flexibility, these are mapped individually in app.js or the router handles specific patterns.

// In our plan:
// GET /api/employees/:employeeId/documents
// POST /api/employees/:employeeId/documents
// GET /api/documents/:documentId
// DELETE /api/documents/:documentId

// For /api/employees/:employeeId/documents
router.get('/employees/:employeeId/documents', documentController.getEmployeeDocuments);
router.post(
  '/employees/:employeeId/documents',
  upload.single('document'),
  validate(uploadDocumentSchema),
  documentController.uploadDocument
);

// For /api/documents/:documentId
router.get('/documents/:documentId', documentController.getDocumentById);
router.delete('/documents/:documentId', documentController.deleteDocument); // Admin or own

module.exports = router;
