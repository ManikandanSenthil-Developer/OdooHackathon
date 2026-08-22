const prisma = require('../config/prisma');

const getEmployees = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const { search, department, designation } = req.query;

    const where = {};
    if (search) {
      where.OR = [
        { employee_id: { contains: search } },
        { name: { contains: search } },
        { email: { contains: search } }
      ];
    }
    if (department) where.department = { contains: department };
    if (designation) where.designation = { contains: designation };

    const [employees, total] = await prisma.$transaction([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        select: {
          employee_id: true,
          name: true,
          email: true,
          designation: true,
          department: true,
          profile_picture: true,
          joining_date: true
          // Intentionally omitting salary for directory view, could make it conditional based on admin role
        }
      }),
      prisma.employee.count({ where })
    ]);

    res.json({
      success: true,
      data: employees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const getEmployeeById = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    
    // Security check: Employee can only view their own profile unless they are ADMIN
    if (req.user.role !== 'ADMIN' && req.user.employee_id !== employeeId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const employee = await prisma.employee.findUnique({
      where: { employee_id: employeeId },
      include: {
        documents: {
          orderBy: { uploaded_at: 'desc' }
        }
      }
    });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const newEmployee = await prisma.employee.create({
      data: req.body
    });
    res.status(201).json({ success: true, message: 'Employee created successfully', data: newEmployee });
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const updatedEmployee = await prisma.employee.update({
      where: { employee_id: employeeId },
      data: req.body
    });
    res.json({ success: true, message: 'Employee updated successfully', data: updatedEmployee });
  } catch (error) {
    next(error);
  }
};

const updateOwnProfile = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    
    // Only allow updating own profile
    if (req.user.employee_id !== employeeId) {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only update your own profile' });
    }

    // Explicitly whitelist allowed fields
    const { phone, address } = req.body;
    
    const updatedEmployee = await prisma.employee.update({
      where: { employee_id: employeeId },
      data: { phone, address }
    });

    res.json({ success: true, message: 'Profile updated successfully', data: updatedEmployee });
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    await prisma.employee.delete({
      where: { employee_id: employeeId }
    });
    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const uploadProfilePicture = async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Both Admin and the employee themselves can update the picture
    if (req.user.role !== 'ADMIN' && req.user.employee_id !== employeeId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const fileUrl = `/uploads/profiles/${req.file.filename}`;

    const updatedEmployee = await prisma.employee.update({
      where: { employee_id: employeeId },
      data: { profile_picture: fileUrl }
    });

    res.json({ success: true, message: 'Profile picture updated successfully', data: { profile_picture: updatedEmployee.profile_picture } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  updateOwnProfile,
  deleteEmployee,
  uploadProfilePicture
};
