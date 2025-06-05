import express from 'express';
const router = express.Router();
import * as Handler from '../handlers/user.ts';

router.post('/identify', Handler.identifyUserHandler );

export default router;
