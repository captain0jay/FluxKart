import { Request, Response } from 'express';
import * as Service from '../services/user.ts';
import * as userResponse from '../response/user.ts';

async function identifyUserHandler(
    req: Request,
    res: Response
) {
    const result = await Service.identifyUserService(req.body);
    const response = userResponse.identifyUserResponse(result);
    res.json({ contact: response?.contact })
}

export { identifyUserHandler}