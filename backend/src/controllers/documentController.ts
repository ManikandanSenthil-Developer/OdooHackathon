import { Response, NextFunction } from 'express';
import { EmployeeService } from '../services/employeeService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getEmployeeDocuments = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params;

    if (req.user?.role !== 'ADMIN' && req.user?.employee_id !== employeeId) {
      res.status(403).json({ success: false, message: 'Forbidden: Access restricted to own documents or Admin.' });
      return;
    }

    const documents = await EmployeeService.getDocuments(employeeId);
    res.status(200).json({ success: true, data: documents });
  } catch (error) {
    next(error);
  }
};

export const uploadDocument = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params;

    if (!req.file) {
      res.status(400).json({ success: false, message: 'No document file uploaded' });
      return;
    }

    if (req.user?.role !== 'ADMIN' && req.user?.employee_id !== employeeId) {
      res.status(403).json({ success: false, message: 'Forbidden: Unauthorized document upload.' });
      return;
    }

    const documentName = req.body.name || req.file.originalname;
    const fileUrl = `/uploads/documents/${req.file.filename}`;

    const doc = await EmployeeService.createDocument(employeeId, {
      name: documentName,
      file_name: req.file.originalname,
      file_url: fileUrl,
      file_type: req.file.mimetype,
      file_size: req.file.size,
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: doc,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { documentId } = req.params;
    await EmployeeService.deleteDocument(documentId);
    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

