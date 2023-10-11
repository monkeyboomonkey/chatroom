import jwt from 'jsonwebtoken';
import {Express, Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv'; 

dotenv.config(); 

export function createJWT(req: Request, res: Response, next: NextFunction): void {
  const token = jwt.sign({ userid: res.locals.user.userid }, String(process.env.JWT_SECRET), {expiresIn: 60});
  // res.cookie("jwt", token, {httpOnly: true, secure: true})
  res.cookie("jwt", token, {httpOnly: true})

  return next();
}

export function verifyJWT(req: Request, res: Response, next: NextFunction): void {
  
}

export function WenzhenTestJWT(req: Request, res: Response, next: NextFunction): void {
  console.log(req.cookies) //req.cookies is good with CORS config, cookie is in request header
  return next()
}