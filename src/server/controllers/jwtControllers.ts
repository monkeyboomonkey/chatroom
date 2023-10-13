import jwt from 'jsonwebtoken';
import {Express, Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv'; 

dotenv.config(); 

export function createJWT(req: Request, res: Response, next: NextFunction): void {
  
  const token = jwt.sign({ userid: res.locals.user.userid }, String(process.env.JWT_SECRET), {expiresIn: 60});
  res.cookie("jwt", token, {httpOnly: true})

  return next();
}

export function verifyJWT(req: Request, res: Response, next: NextFunction): void {
  // if(user_id is given)

  //     verify JWT using user_id
  // else       search db for (req.query.username)->user_id
  //     verify JWT using user_id
  // temp setup for testing purpose
  return next();
}