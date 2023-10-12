import jwt from 'jsonwebtoken';
import {Express, Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv'; 

dotenv.config(); 

// need to call createJWT, as it refreshes our token;
  // in registering, logging in, 
export function createJWT(req: Request, res: Response, next: NextFunction): void {
  // if accessing from logging in
  if (res.locals.userid || (res.locals.user && res.locals.user.userid)) {
    const token = jwt.sign({ userid: res.locals.user.userid }, String(process.env.JWT_SECRET), {expiresIn: 60});
  // accessing from registering user
  } else {

  }
  const token = jwt.sign({ userid: res.locals.user.userid }, String(process.env.JWT_SECRET), {expiresIn: 60});
  // res.locals.token = token;
  res.cookie("jwt", token, {httpOnly: true})

  return next();
}

export function verifyJWT(req: Request, res: Response, next: NextFunction): void {
  // if(user_id is given)
    // verify JWT using user_id
  // else search db for (req.query.username)->user_id
    // verify JWT using user_id
//^ i think this needs to be create instead
  try { 
    jwt.verify(req.cookies.jwt, String(process.env.JWT_SECRET));
    res.locals.verify = true;
    return next();
  } catch { 
    res.locals.verify = false;
    // return next('error verifying your jwt') 
    return next();
  };

}

// just for testing purpose
export function WenzhenTestJWT(req: Request, res: Response, next: NextFunction): void {
  console.log(req.cookies) //req.cookies is good with CORS config, cookie is in request header
  return next()
}