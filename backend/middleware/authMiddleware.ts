import { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { AuthRequest } from '../types/expressReq';

interface decodedToken {
  id: string;
  iat: number;
  exp: number;
}

const protect = expressAsyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string = '';
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as decodedToken;

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error: any) {
      console.error(error);
      res.status(401);
      throw new Error('Not authroized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, missing token');
  }
});
export { protect };
