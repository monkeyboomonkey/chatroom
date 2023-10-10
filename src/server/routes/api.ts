import express, { Request, Response } from 'express';
import { getAllUsers, registerUser, userLogIn, deleteUser, updateUser } from '../controllers/userControllers.js'
import { getAllChatrooms, addChatroom } from '../controllers/chatroomControllers.js'
import { addChatlog, getAllChatlogs } from '../controllers/chatlogControllers.js'

import { createJWT } from '../controllers/jwtControllers.js'

export const router = express.Router();

// User routes
// intend to add verifyJWT before and createJWT(renew JWT) after userLogIn, updateUser in '/updateuser' because it is a user operation
// intend to add verifyJWT before deleteUser because it is a user operation
router.get('/getallusers', getAllUsers, (req: Request, res: Response):void => {res.status(200).json(res.locals.allUsers)});
router.post('/registeruser', registerUser, (req: Request, res: Response):void => {res.status(200).json('user registered')});
router.get('/userlogin', userLogIn, createJWT, (req: Request, res: Response):void => {res.status(200).json(res.locals.user)});
router.delete('/deleteuser', deleteUser, (req: Request, res: Response):void => {res.status(200).json('user deleted')});
router.patch('/updateuser', userLogIn, updateUser, (req: Request, res: Response):void => {res.status(200).json(res.locals.user)});

// Chatroom routes
// intend to add verifyJWT before and createJWT(renew JWT) after addchatroom because it is a user operation
router.get('/getallchatrooms', getAllChatrooms, (req: Request, res: Response):void => {res.status(200).json(res.locals.allChatrooms)});
router.post('/addchatroom', addChatroom, (req: Request, res: Response):void => {res.status(200).json('chatroom added')});

// Chatlog routes
// intend to add verifyJWT before and createJWT(renew JWT) after addChatlog and getAllChatlogs because they are user operations
router.post('/addchatlog', addChatlog, (req: Request, res: Response):void => {res.status(200).json(res.locals.chatlog)});
router.get('/getallchatlogs', getAllChatlogs, (req: Request, res: Response):void => {res.status(200).json(res.locals.chatlogs_in_chatroom)});
