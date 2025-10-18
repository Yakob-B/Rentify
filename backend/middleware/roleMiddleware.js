// Role-based access control middleware

// Check if user has specific role
const hasRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ 
        message: `Access denied. Required role: ${role}` 
      });
    }
  };
};

// Check if user has any of the specified roles
const hasAnyRole = (roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ 
        message: `Access denied. Required roles: ${roles.join(' or ')}` 
      });
    }
  };
};

// Check if user is owner of resource or admin
const isOwnerOrAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    return next();
  }

  const resourceOwnerId = req.params.userId || req.body.owner || req.resource?.owner;
  if (req.user._id.toString() === resourceOwnerId?.toString()) {
    return next();
  }

  res.status(403).json({ 
    message: 'Access denied. You can only access your own resources.' 
  });
};

module.exports = {
  hasRole,
  hasAnyRole,
  isOwnerOrAdmin
};
