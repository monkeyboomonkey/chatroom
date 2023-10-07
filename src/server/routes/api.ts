import express, { Request, Response } from 'express';
import { getAllUsers, registerUser, userLogIn, deleteUser } from '../controllers/chatRoomControllers.js'

export const router = express.Router();

router.get('/getallusers', getAllUsers, (req: Request, res: Response):void => {res.status(200).json(res.locals.allUsers)});
router.post('/registeruser', registerUser, (req: Request, res: Response):void => {res.status(200).json('user registered')});
router.get('/userlogin', userLogIn, (req: Request, res: Response):void => {res.status(200).json(res.locals.user)});
router.delete('/deleteuser', deleteUser, (req: Request, res: Response):void => {res.status(200).json('user deleted')});