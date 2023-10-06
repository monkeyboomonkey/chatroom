import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { users } from '../models/psqlmodels.js'
import dotenv from 'dotenv'; 
dotenv.config(); 

const connectionString = String(process.env.POSTGRES_URI)
const client = postgres(connectionString)
const db = drizzle(client);

import {Express, Request, Response, NextFunction} from 'express';

export function getAllUsers(req: Request, res: Response, next: NextFunction): void {
  db.select().from(users).then(data => {
    
    res.locals.allUsers = data
    return next();

  })
  .catch(e => {
    return next('failed to getAllUsers')
  })
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send(err);
};