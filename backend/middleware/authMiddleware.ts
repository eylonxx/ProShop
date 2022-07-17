import { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

const protect = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token: string = '';
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      let token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error: any) {
      console.log(error);
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
