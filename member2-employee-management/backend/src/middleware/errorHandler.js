const { ZodError } = require('zod');
const { Prisma } = require('@prisma/client');
const multer = require('multer');

const errorHandler = (err, req, res, next) => {
  console.error('[Error]:', err);

  // 1. Validation Errors (Zod)
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
    });
  }

  // 2. Prisma Known Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint failed
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: `Duplicate record found for ${err.meta.target}`,
        error: 'DUPLICATE_RECORD'
      });
    }
    // Record not found (e.g. on update/delete)
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
        error: 'NOT_FOUND'
      });
    }
  }

  // 3. Prisma Validation Errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      message: 'Database validation failed (invalid data format)',
      error: 'PRISMA_VALIDATION_ERROR'
    });
  }

  // 4. File Upload Errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size limit exceeded',
        error: 'FILE_TOO_LARGE'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
      error: 'FILE_UPLOAD_ERROR'
    });
  }

  // 5. Unexpected Errors
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred',
    error: 'INTERNAL_SERVER_ERROR'
  });
};

module.exports = errorHandler;
