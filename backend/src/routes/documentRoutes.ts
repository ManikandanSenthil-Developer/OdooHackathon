import { Router } from 'express';
import {
  getEmployeeDocuments,
  uploadDocument,
  deleteDocument,
} from '../controllers/documentController';
import { verifyToken } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.use(verifyToken);

router.get('/employees/:employeeId/documents', getEmployeeDocuments);
router.post(
  '/employees/:employeeId/documents',
  upload.single('document'),
  uploadDocument
);
router.delete('/documents/:documentId', deleteDocument);

export default router;

