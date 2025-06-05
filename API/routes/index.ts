import express from 'express';
const router = express.Router();
import v1Routes from '../v1.0/routes/index.ts'

router.use('/v1.0', v1Routes);

export default router