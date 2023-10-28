import { drizzle } from 'drizzle-orm/postgres-js'
import { eq, lt, gte, ne, and } from "drizzle-orm";

import postgres from 'postgres'
import { chatrooms } from '../models/psqlmodels.js'
import dotenv from 'dotenv'; 

dotenv.config(); 

const connectionString = String(process.env.POSTGRES_URI)
const client = postgres(connectionString)
const db = drizzle(client);

import {Express, Request, Response, NextFunction} from 'express';

export function getAllChatrooms(req: Request, res: Response, next: NextFunction): void {

  db.select().from(chatrooms)
  .then(data => {
    res.locals.allChatrooms = data
    return next();
  })
  .catch(e => {
    return next('failed to getAllChatrooms');
  })
}

export async function addChatroom(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { chatroom_name } = req.body;

  const foundChatroom_name = await db.select().from(chatrooms).where(eq(chatrooms.chatroom_name, chatroom_name));
  if(!foundChatroom_name.length){
    try{
      await db.insert(chatrooms).values({ chatroom_name })
      res.locals.chatroom_name = chatroom_name;
      return next();
    }
    catch(e){
      return next('failed to addChatroom');
    }
  }
  else{
    return next('Chatroom exists');
  }
}