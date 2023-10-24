import { nextTick } from "process";
import { redisClient } from "../models/redismodels.js";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, lt, gte, ne, and } from "drizzle-orm";
import postgres from "postgres";
import { users, chatlogs,chatrooms } from '../models/psqlmodels.js'
import dotenv from "dotenv";
import {Express, Request, Response, NextFunction} from 'express';

dotenv.config();

const connectionString = String(process.env.POSTGRES_URI);
const client = postgres(connectionString);
const db = drizzle(client);

redisClient.on("error", (err) => console.log("Redis Client Error", err));
await redisClient.connect();



export async function addChatroomLogRedis (req: Request, res: Response, next: NextFunction): Promise<void>  {
  const { timestamp } = res.locals;
  const { chatroom_id, username, message } = req.body;

  const redisData = JSON.stringify({
    username: username,
    message: message,
    timestamp: timestamp,
  });
  try {
    await redisClient.lPush(chatroom_id, redisData);
    const listLen = await redisClient.lLen(chatroom_id);
    if (listLen > 10) {
      // If lenght of current chatroom ID is greater than 30, trim the first 5
      await redisClient.lTrim(chatroom_id, 0, 4);
    }
    return next();
  } catch (e) {
    console.log("Error pushing to redis database: ", e);
    return next(e);
  }
};

export async function getChatHistoryRedis (req: Request, res: Response, next: NextFunction): Promise<void>  {
  const { chatroom_id } = req.body;
  try {
    const redisQueryResult = await redisClient.LRANGE(chatroom_id, 0, -1); // this returns all items in list
    res.locals.redisQueryResult = redisQueryResult
    // Clean data and store into res.locals to send back to client side
    return next();
  } catch (e) {
    console.log("Error pushing to redis database: ", e);
    return next(e);
  }
};

// Controllers for frequent calls to database, should contact redis rather the SQL database
// Getting user ID,


export async function setUserIDRedis(req: Request, res: Response, next: NextFunction): Promise<void> {
  // after registering a user , the users' username and id are uploaded into redis database
  const { username } = res.locals;
  try {
    const ID = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    await redisClient.set(username, ID[0].userid); 
    return next();
  } catch (e) {
    console.log("Unable to set user", e);
    return next(e);
  }
};

export async function getUserID (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { username } = req.body;
  try {
    const userID = await redisClient.get(username);
    res.locals.userID = userID;
    return next();
  } catch (e) {
    console.log("Unable to get userID", e);
    return next(e);
  }
};

export async function  setChatroomIDRedis (req: Request, res: Response, next: NextFunction): Promise<void>  {
  const { chatroom_name } = res.locals;
  try {
    const chatroomID = await db
      .select()
      .from(chatrooms)
      .where(eq(chatrooms.chatroom_name, chatroom_name));
    await redisClient.set(chatroom_name, chatroomID[0].chatroom_id);
    return next();
  } catch (e) {
    console.log("Unable to set user", e);
    return next(e);
  }
};

export async function getChatroomID (req: Request, res: Response, next: NextFunction): Promise<void>  {
  const { chatroom_name } = req.body;
  try {
    const chatroomID = await redisClient.get(chatroom_name);
    res.locals.chatroomID = chatroomID;
    return next();
  } catch (e) {
    console.log("Unable to get chatroom_id", e);
    return next(e);
  }
};
