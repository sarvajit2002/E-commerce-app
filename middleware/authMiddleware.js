import JWT from 'jsonwebtoken';
import userModel from '../models/userModels.js';

export const requireSignIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }
    
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user has the admin role
    if (user.role !== 1) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized Access',
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      error,
      message: 'Error in admin middleware',
    });
  }
};
