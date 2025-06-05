import express from 'express';
const router = express.Router();

import userRoutes from './user.ts'
import { validateBody } from '../../../utils/validate.ts';
import { userSchema } from '../validators/user.ts';

router.use('/user', validateBody(userSchema), userRoutes);

export default router;
