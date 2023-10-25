import { drizzle } from 'drizzle-orm/postgres-js'
import { eq, lt, gte, ne, and, or } from "drizzle-orm";

import postgres from 'postgres'
import { users } from '../models/psqlmodels.js'
import dotenv from 'dotenv';
import { hashSync, compareSync } from "bcrypt-ts";
import jwt from 'jsonwebtoken';

dotenv.config();

const connectionString = String(process.env.POSTGRES_URI)
const client = postgres(connectionString)
const db = drizzle(client);
const result = await db.select().from(users);

import { Express, Request, Response, NextFunction } from 'express';
import { current } from '@reduxjs/toolkit';
import { profile } from 'console';

export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { firstName, lastName, email, username, profilePicture } = req.body;
  const { userid } = res.locals;
  if (!firstName && !lastName && !email && !username && !profilePicture) return next('Missing required fields');

  const foundNewUsername = username ? await db.select().from(users).where(and(eq(users.username, username), ne(users.userid, userid))) : [];
  const foundNewEmail = email ? await db.select().from(users).where(and(eq(users.email, email), ne(users.userid, userid))) : [];
  if (!foundNewUsername.length && !foundNewEmail.length) {
    try {
      const currentUser = await db.select().from(users).where(eq(users.userid, userid));
      const userCredentials = {
        fn: !firstName ? currentUser[0].fn : firstName,
        ln: !lastName ? currentUser[0].ln : lastName,
        email: !email ? currentUser[0].email : email,
        username: !username ? currentUser[0].username : username,
        pictureURL: !profilePicture ? currentUser[0].pictureURL : profilePicture,
      }
      const newUser = await db.update(users).set(userCredentials).where(eq(users.userid, userid)).returning();
      res.locals.user = newUser[0];
      console.log(res.locals.user)
      return next();
    } catch (e) {
      console.log(e)
      return next('failed to updateUser');
    }
  } else if (foundNewUsername.length) {
    return next('Username exists');
  } else {
    return next('Email exists');
  }
}

export function deleteUser(req: Request, res: Response, next: NextFunction): void {
  db.delete(users).where(eq(users.username, String(req.query.username))).returning()
    .then(user => {
      if (user.length) {
        return next()
      }
      else {
        return next('No user to delete')
      }
    })
    .catch(e => {
      return next('failed to deleteUser');
    })
}

export function userLogIn(req: Request, res: Response, next: NextFunction): void {
  const { username, password } = req.body;
  db.select().from(users).where(eq(users.username, username))
    .then(user => {
      if (user.length) {
        console.log(user)
        if (compareSync(password, String(user[0].password))) {
          res.locals.user = user[0]
          return next();
        }
        // wrong password
        return next('Log in info does not match 00')
      }
      else {
        // cannot find user
        return next('Log in info does not match 01')
      }
    })
    .catch(e => {
      return next('failed to userLogin');
    });
}

export async function registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {

  const { fn, ln, username, email, password } = req.body;
  if (!fn && !ln && !username && !email && !password) return next('Missing required fields');
  res.locals = {username:username}

  // look for a user documents with the same username or email
  console.log(fn, ln, username, email, password)
  let user: any;
  if (email) {
    user = await db.select().from(users).where(or(eq(users.username, username), eq(users.email, email)));
  } else {
    user = await db.select().from(users).where(eq(users.username, username));
  }

  if (!user.length) {
    try {
      await db.insert(users).values({ fn: fn || null, ln: ln || null, username, email: email || null, password: hashSync(password, 10) })
      return next();
    }
    catch (e) {
      return next('failed to registerUser');
    }
  }
  else if (user[0].username === username) {
    return next('Username exists');
  }
  else {
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


// export async function getUser(req: Request, res: Response, next: NextFunction):Promise<void>  {
//   const {username} = req.body
//   // console.log(username)
//   const query  = await db.select().from(users).where((eq(users.username,username)))
//   const urlLink = query[0].pictureURL
//   // console.log(urlLink)
//   res.locals.pictureURL = urlLink
//   return next()
// }

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err);
  if (res.locals.verify === false) {
    res.status(401).json({ status: false })
  } else {
    res.status(500).send(err);
  }
};
