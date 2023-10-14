import express, { Request, Response } from 'express';
import { getAllUsers, registerUser, userLogIn, deleteUser, updateUser } from '../controllers/userControllers.js'
import { getAllChatrooms, addChatroom } from '../controllers/chatroomControllers.js'
import { addChatlog, getAllChatlogs } from '../controllers/chatlogControllers.js'

import { createJWT, verifyJWT, deleteJWT } from '../controllers/jwtControllers.js'


export const router = express.Router();

// User routes
// intend to add verifyJWT before and createJWT(renew JWT) after userLogIn, updateUser in '/updateuser' because it is a user operation
// intend to add verifyJWT before deleteUser because it is a user operation
router.get('/getallusers', getAllUsers, (req: Request, res: Response): void => { res.status(200).json(res.locals.allUsers) });
router.post('/registeruser', registerUser, (req: Request, res: Response): void => { res.status(200).json('user registered') });
router.post('/userlogin', userLogIn, createJWT, (req: Request, res: Response): void => { res.status(200).json(res.locals.user); });
router.delete('/deleteuser', verifyJWT, deleteUser, deleteJWT, (req: Request, res: Response): void => { res.status(200).json('user deleted') });
router.patch('/updateuser', verifyJWT, updateUser, createJWT, (req: Request, res: Response): void => { res.status(200).json(res.locals.user) });
router.delete('/userlogout', deleteJWT, (req: Request, res: Response): void => { res.status(200).json('user logged out') })

// Chatroom routes
// intend to add verifyJWT before and createJWT(renew JWT) after addchatroom because it is a user operation
router.get('/getallchatrooms', verifyJWT, getAllChatrooms, createJWT, (req: Request, res: Response): void => { res.status(200).json(res.locals.allChatrooms) });
router.post('/addchatroom', verifyJWT, addChatroom, createJWT, (req: Request, res: Response): void => { res.status(200).json('chatroom added') });


// Chatlog routes
// intend to add verifyJWT before and createJWT(renew JWT) after addChatlog and getAllChatlogs because they are user operations
router.post('/addchatlog', verifyJWT, addChatlog, createJWT, (req: Request, res: Response): void => { res.status(200).json(res.locals.chatlog) });
router.get('/getallchatlogs', verifyJWT, getAllChatlogs, createJWT, (req: Request, res: Response): void => { res.status(200).json(res.locals.chatlogs_in_chatroom) });

// route just for verification, if needed
// currently just responds with a boolean if the user is verified or not
router.get('/verify', verifyJWT,
  (req: Request, res: Response): void => {
    let variableStatus = 500;
    if (res.locals.verify) {
      variableStatus = 200;
    }
    res.status(variableStatus).json(res.locals.verify)
  }
)
