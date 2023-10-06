import express, { Request, Response } from 'express';
import { getAllUsers } from '../controllers/chatRoomControllers.js'

export const router = express.Router();

router.get('/getusers', getAllUsers, (req: Request, res: Response):void => {res.status(200).json(res.locals.allUsers)});