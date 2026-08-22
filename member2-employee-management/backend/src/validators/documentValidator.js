const { z } = require('zod');

const uploadDocumentSchema = z.object({
  params: z.object({
    employeeId: z.string()
  }),
  body: z.object({
    name: z.string().min(1, 'Document name is required')
  })
});

module.exports = {
  uploadDocumentSchema
};
