import  express from 'express';
// import { registerUser, authenticateUser, refreshToken } from '../controllers/auth.controllers';

import { body } from 'express-validator';

const router = express.Router();

router.post('/register', body('email').isEmail(), body('password').isLength({ min: 4 }), registerUser);
// router.post('/authenticate', authenticateUser);
// router.post('/token', refreshToken);

export { router as authRoute };