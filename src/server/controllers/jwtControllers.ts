import jwt, { Jwt } from 'jsonwebtoken';
import {Express, Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv'; 

// next 8 lines just for createJWT to access data base
import { drizzle } from 'drizzle-orm/postgres-js'
import { eq, lt, gte, ne, and } from "drizzle-orm";
import postgres from 'postgres'
import { users } from '../models/psqlmodels.js'
const connectionString = String(process.env.POSTGRES_URI)
const client = postgres(connectionString)
const db = drizzle(client);

dotenv.config(); 

// need to call createJWT, as it refreshes our token;
  // in registering, logging in, updating profile, messaging & creating a chatroom...
export function createJWT(req: Request, res: Response, next: NextFunction): void {
  // if accessing from logging in, aka the only time we have the id naturally
  if (res.locals.user && res.locals.user.userid) {
    res.locals.token = jwt.sign({ userid: res.locals.user.userid }, String(process.env.JWT_SECRET), {expiresIn: 60});
  // accessing from just the username given
  } else {
    const { username } = req.body;
    db.select().from(users).where(eq(users.username, username))
    .then(user => {
      if(user.length){
        res.locals.token = jwt.sign({ userid: user[0].userid }, String(process.env.JWT_SECRET), {expiresIn: 60});
      } else{
        // cannot find user
        return next('User does not exist, possible db error')
      }
    }).catch(e => {
      return next('failed to userLogin: ' + e);
    })
  }
  res.cookie("jwt", res.locals.token, {httpOnly: true})
  return next();
}

export function verifyJWT(req: Request, res: Response, next: NextFunction): void {
  try { 
    jwt.verify(req.cookies.jwt, String(process.env.JWT_SECRET));
    res.locals.verify = true;
    return next();
  } catch { 
    // torn between sending something thru res.locals so the frontend can know
    // res.locals.verify = false;
    // or just erroring out, because does the front end necessarily need to know?
    return next('error verifying your login') 
    // return next();
  };

}