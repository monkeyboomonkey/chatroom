import jwt from 'jsonwebtoken';
import {Express, Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv'; 

dotenv.config(); 

export function createJWT(req: Request, res: Response, next: NextFunction): void {
  const token = jwt.sign({ userid: res.locals.user.userid }, String(process.env.JWT_SECRET), {expiresIn: 60});
  res.locals.token = token;
  res.cookie("jwt", token, {httpOnly: true, secure: true})
  return next();
}

export function verifyJWT(req: Request, res: Response, next: NextFunction): void {
  try { 
    jwt.verify(res.locals.token, String(process.env.JWT_SECRET));
    return next();
  } catch { 
    return next('error verifying your jwt') 
  };
}