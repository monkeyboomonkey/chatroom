import jwt, { JwtPayload } from 'jsonwebtoken';
import {Express, Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv'; 

dotenv.config(); 

// need to call createJWT, as it refreshes our token;
  // in registering, logging in, updating profile, messaging & creating a chatroom...
export function createJWT(req: Request, res: Response, next: NextFunction): void {
  // if accessing from logging in, aka the only time we have the id naturally
  if (res.locals.user && res.locals.user.userid) {
    res.locals.token = jwt.sign({ userid: res.locals.user.userid }, String(process.env.JWT_SECRET), {expiresIn: 60});
    res.cookie("jwt", res.locals.token, {httpOnly: true})
    return next();
  } else {
    return next('error with token creation')
  }
  //console.log("cookie added: ", res.locals.token)
}

export function verifyJWT(req: Request, res: Response, next: NextFunction): void {
  try { 
    // console.log("verifying the token")
    const data = jwt.verify(req.cookies.jwt, String(process.env.JWT_SECRET)) as JwtPayload;
    res.locals.verify = true;
    res.locals.user = { "userid": data.userid }
    return next();
  } catch { 
    // torn between sending something thru res.locals so the frontend can know
    // res.locals.verify = false;
    // or just erroring out, because does the front end necessarily need to know?
    return next('error verifying your login') 
    // return next();
  };
}