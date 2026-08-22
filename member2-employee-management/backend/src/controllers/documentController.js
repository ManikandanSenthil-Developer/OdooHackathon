const prisma = require('../config/prisma');
const fs = require('fs');
const path = require('path');

const getEmployeeDocuments = async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    if (req.user.role !== 'ADMIN' && req.user.employee_id !== employeeId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const documents = await prisma.document.findMany({
      where: { employee_id: employeeId },
      orderBy: { uploaded_at: 'desc' }
    });

    res.json({ success: true, data: documents });
  } catch (error) {
    next(error);
  }
};

const uploadDocument = async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    if (req.user.role !== 'ADMIN' && req.user.employee_id !== employeeId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { name } = req.body;
    const fileUrl = `/uploads/documents/${req.file.filename}`;

    // Ensure employee exists
    const employee = await prisma.employee.findUnique({
      where: { employee_id: employeeId }
    });

    if (!employee) {
      // Cleanup the uploaded file to avoid orphans
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const newDocument = await prisma.document.create({
      data: {
        employee_id: employeeId,
        name,
        file_name: req.file.originalname,
        file_url: fileUrl,
        file_type: req.file.mimetype,
        file_size: req.file.size
      }
    });

    res.status(201).json({ success: true, message: 'Document uploaded successfully', data: newDocument });
  } catch (error) {
    next(error);
  }
};

const getDocumentById = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    const document = await prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (req.user.role !== 'ADMIN' && req.user.employee_id !== document.employee_id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    res.json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    const document = await prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (req.user.role !== 'ADMIN' && req.user.employee_id !== document.employee_id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    await prisma.document.delete({
      where: { id: documentId }
    });

    // Remove the physical file
    const filePath = path.join(process.cwd(), document.file_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployeeDocuments,
  uploadDocument,
  getDocumentById,
  deleteDocument
};
