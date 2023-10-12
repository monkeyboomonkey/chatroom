import { drizzle } from 'drizzle-orm/postgres-js'
import { eq, lt, gte, ne, and } from "drizzle-orm";

import postgres from 'postgres'
import { users, chatlogs } from '../models/psqlmodels.js'
import dotenv from 'dotenv'; 

dotenv.config(); 

const connectionString = String(process.env.POSTGRES_URI)
const client = postgres(connectionString)
const db = drizzle(client);

import {Express, Request, Response, NextFunction} from 'express';

export async function getAllChatlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { chatroom_id } = req.body;
  try{

    const chatlogs_in_chatroom = await db.select().from(chatlogs).where(eq(chatlogs.chatroom_id, chatroom_id)).as('chatlogs_in_chatroom');

    const chatlogs_in_chatroom_username = 
    await db.select({username: users.username, timestamp:chatlogs_in_chatroom.timestamp, message: chatlogs_in_chatroom.message})
    .from(users)
    .rightJoin(chatlogs_in_chatroom, eq(users.userid, chatlogs_in_chatroom.userid));
    
    res.locals.chatlogs_in_chatroom = chatlogs_in_chatroom_username;
    return next();
  }
  catch(e){
    return next('failed to getAllChatlogs');
  }
}

export function addChatlog(req: Request, res: Response, next: NextFunction): void {
  const { chatroom_id, userid, message } = req.body;
  
  db.insert(chatlogs).values({ chatroom_id, userid, message }).returning()
  .then(chatlog => {
    res.locals.chatlog = chatlog;
    return next();
  })
  .catch(e => {
    return next('failed to addChatlog');
  })
}