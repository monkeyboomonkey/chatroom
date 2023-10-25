import jwt, { JwtPayload } from 'jsonwebtoken';
import { Express, Request, Response, NextFunction } from 'express';
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
export async function createJWT(req: Request, res: Response, next: NextFunction): Promise<void> {
  // if accessing from logging in, aka the only time we have the id naturally
  if (res.locals.user && res.locals.user.userid) {
    res.locals.token = jwt.sign({ userid: res.locals.user.userid }, String(process.env.JWT_SECRET), { expiresIn: 3000 });
  } else {
    // accessing from just the username
    const { username } = req.body;
    //console.log("username: ", username);
    // switched from using .then & .catch, as to be more DRY with token setting
    // and to fix and error where server would crash upon incorrect info
    const foundUser = await db.select().from(users).where(eq(users.username, username)).catch()
    //console.log("found user: ", user)
    if (foundUser.length) {
      res.locals.token = jwt.sign({ userid: foundUser[0].userid }, String(process.env.JWT_SECRET), { expiresIn: 3000 });
      //console.log('token set: ', res.locals.token)
    } else {
      // cannot find user
      return next('User does not exist, possible db error')
    }
  }
  //console.log("cookie added: ", res.locals.token)
  res.cookie("jwt", res.locals.token, { httpOnly: true })
  return next();
}

export async function verifyJWT(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = jwt.verify(req.cookies.jwt, String(process.env.JWT_SECRET));
    
    if (typeof data === 'object' && 'userid' in data) {
      const user = await db.select().from(users).where(eq(users.userid, String(data.userid)));
      if (!user.length) throw new Error('Invalid JWT payload');
      res.locals.userid = data.userid;
      res.locals.username = user[0].username;
      res.locals.user = user[0];
      res.locals.verify = true;
      return next();
    } else {
      res.locals.verify = false;
      throw new Error('Invalid JWT payload');
    }
  } catch {
    // torn between sending something thru res.locals so the frontend can know
    res.locals.verify = false;
    // or just erroring out, because does the front end necessarily need to know?
    return next('error verifying your login')
    // return next();
  };
}

export function deleteJWT(req: Request, res: Response, next: NextFunction): void {
  res.clearCookie('jwt')
  res.locals.user = null;
  return next();
}