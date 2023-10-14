import { drizzle } from 'drizzle-orm/postgres-js'
import { eq, lt, gte, ne, and } from "drizzle-orm";

import postgres from 'postgres'
import { users } from '../models/psqlmodels.js'
import dotenv from 'dotenv'; 
import { hashSync, compareSync } from "bcrypt-ts";

dotenv.config(); 

const connectionString = String(process.env.POSTGRES_URI)
const client = postgres(connectionString)
const db = drizzle(client);

import {Express, Request, Response, NextFunction} from 'express';

export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { userid, newfn, newln, newemail, newusername, newpassword } = req.body;
  
  const foundNewUsername = await db.select().from(users).where(and(eq(users.username, newusername), ne(users.userid, userid)));
  const foundNewEmail = await db.select().from(users).where(and(eq(users.email, newemail), ne(users.userid, userid)));
  if(!foundNewUsername.length && !foundNewEmail.length){
    if(newpassword){
      try{
        const newUser = await db.update(users).set({ fn: newfn, ln: newln, email: newemail, username: newusername, password: hashSync(newpassword, 10) }).where(eq(users.userid, userid)).returning();
        res.locals.user = newUser[0];
        return next();
      }
      catch(e){
        return next('failed to updateUser');
      }
    }
    else{
      try{
        const newUser = await db.update(users).set({ fn: newfn, ln: newln, email: newemail, username: newusername }).where(eq(users.userid, userid)).returning();
        res.locals.user = newUser[0];
        return next();
      }
      catch(e){
        return next('failed to updateUser');
      }
    }
  }
  else if(foundNewUsername.length){
    return next('Username exists');
  }
  else{
    return next('Email exists');
  }
}

export function deleteUser(req: Request, res: Response, next: NextFunction): void {
  db.delete(users).where(eq(users.username, String(req.query.username))).returning()
  .then(user => {
    if(user.length){
      return next()
    }
    else{
      return next('No user to delete')
    }
  })
  .catch(e => {
    return next('failed to deleteUser');
  })
}

export function userLogIn(req: Request, res: Response, next: NextFunction): void {
  const {username, password} = req.body;

  db.select().from(users).where(eq(users.username, username))
  .then(user => {
    if(user.length){
      if(compareSync(password, String(user[0].password))){
        

        res.locals.user = user[0]
        return next();
      }
      // wrong password
      return next('Log in info does not match 00')
    }
    else{
      // cannot find user
      return next('Log in info does not match 01')
    }
  })
  .catch(e => {
    return next('failed to userLogin');
  })

}

export async function registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {

  const {fn, ln, username, email, password} = req.body;

  const foundUsername = await db.select().from(users).where(eq(users.username, username));
  const foundEmail = await db.select().from(users).where(eq(users.email, email));

  if(!foundUsername.length && !foundEmail.length){
    try{
      await db.insert(users).values({ fn, ln, username, email, password: hashSync(password, 10) })
      return next();
    }
    catch(e){
      return next('failed to registerUser');
    }
  }
  else if(foundUsername.length){
    return next('Username exists');
  }
  else{
    return next('Email exists');
  }
}

export function getAllUsers(req: Request, res: Response, next: NextFunction): void {
  db.select().from(users)
  .then(data => {
    
    res.locals.allUsers = data
    return next();

  })
  .catch(e => {
    return next('failed to getAllUsers');
  })
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction):void => {
  console.error(err);
  res.status(500).json(err);
};