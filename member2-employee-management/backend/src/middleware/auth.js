/**
 * Mock Authentication Middleware
 * In the actual project, this should be replaced by Member 1's JWT middleware.
 * We are expecting it to set `req.user = { employee_id, role }`.
 */
const auth = (req, res, next) => {
  // Temporary mock: 
  // In dev, you might pass 'employee_id' and 'role' via custom headers 
  // or use a static mock user if no header is present to facilitate testing.
  
  const mockEmployeeId = req.headers['x-mock-employee-id'] || 'EMP001';
  const mockRole = req.headers['x-mock-role'] || 'ADMIN'; // or 'EMPLOYEE'

  req.user = {
    employee_id: mockEmployeeId,
    role: mockRole
  };

  next();
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Forbidden: Admin access required',
      error: 'FORBIDDEN_ACCESS'
    });
  }
};

module.exports = { auth, requireAdmin };
