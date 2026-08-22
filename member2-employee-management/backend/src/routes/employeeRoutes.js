const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { auth, requireAdmin } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createEmployeeSchema,
  updateEmployeeSchema,
  updateOwnProfileSchema,
  getEmployeesQuerySchema
} = require('../validators/employeeValidator');
const upload = require('../middleware/upload');

router.use(auth);

// ADMIN/HR routes
router.get('/', requireAdmin, validate(getEmployeesQuerySchema), employeeController.getEmployees);
router.post('/', requireAdmin, validate(createEmployeeSchema), employeeController.createEmployee);
router.put('/:employeeId', requireAdmin, validate(updateEmployeeSchema), employeeController.updateEmployee);
router.delete('/:employeeId', requireAdmin, employeeController.deleteEmployee);

// EMPLOYEE/SHARED routes
router.get('/:employeeId', employeeController.getEmployeeById);
router.patch('/:employeeId/profile', validate(updateOwnProfileSchema), employeeController.updateOwnProfile);
router.patch('/:employeeId/profile-picture', upload.single('profile_picture'), employeeController.uploadProfilePicture);

module.exports = router;
