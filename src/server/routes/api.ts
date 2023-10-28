import express, { Request, Response } from 'express';
import { getAllUsers, registerUser, userLogIn, deleteUser, updateUser } from '../controllers/userControllers.js'
import { getAllChatrooms, addChatroom } from '../controllers/chatroomControllers.js'
import { addChatlog } from '../controllers/chatlogControllers.js'
import {addChatroomLogRedis,getChatHistoryRedis, getChatroomID, getUserID, setUserIDRedis,setChatroomIDRedis}  from "../controllers/chatlogControllerRedis.js"
import { createJWT, verifyJWT, deleteJWT } from '../controllers/jwtControllers.js'
import { getAWSURL } from '../controllers/imagesController.js';


export const router = express.Router();

router.get('/getallusers', getAllUsers, (_req: Request, res: Response): void => {
  res.status(200).json(res.locals.allUsers)
});
//  router.post('/getUser', getUser, (req: Request, res: Response): void => {
//   res.status(200).json(res.locals.pictureURL)
// });

router.post('/registeruser', registerUser, setUserIDRedis, (_req: Request, res: Response): void => {
  res.status(200).json('user registered')
});

router.post('/userlogin', userLogIn, createJWT, (_req: Request, res: Response): void => {
  const username = res.locals.user.username;
  res.status(200).json({username});
});

router.delete('/deleteuser', verifyJWT, deleteUser, deleteJWT, (req: Request, res: Response): void => {
  res.status(200).json('user deleted')
});

router.patch('/updateuser', verifyJWT, updateUser, createJWT, (req: Request, res: Response): void => {
  res.status(200).json({
  username: res.locals.user.username,
  email: res.locals.user.email,
  fn: res.locals.user.fn,
  ln: res.locals.user.ln,
  pictureURL: res.locals.user.pictureURL,
})});

router.delete('/userlogout', deleteJWT, (_req: Request, res: Response): void => { res.status(200).json('user logged out') });

// Chatroom routes
// intend to add verifyJWT before and createJWT(renew JWT) after addchatroom because it is a user operation
router.get('/getallchatrooms', verifyJWT, getAllChatrooms, createJWT, (req: Request, res: Response): void => {
  res.status(200).json(res.locals.allChatrooms)
});

router.post('/addchatroom', verifyJWT, addChatroom, setChatroomIDRedis, createJWT,(req: Request, res: Response): void => {
  res.status(200).json('chatroom added')
});

// Chatlog routes
// intend to add verifyJWT before and createJWT(renew JWT) after addChatlog and getAllChatlogs because they are user operations
router.post('/addchatlog', verifyJWT, addChatlog, addChatroomLogRedis, createJWT, (req: Request, res: Response): void => {
  res.status(200).json(res.locals.chatlog)
});

// Can probably delete line 32 route since we have Redis route now
// router.get('/getallchatlogs', verifyJWT, getAllChatlogs, createJWT, (req: Request, res: Response): void => { res.status(200).json(res.locals.chatlogs_in_chatroom) });
// Adding a new redis route for getting chat history
router.get('/getallchatlogs', verifyJWT, getChatHistoryRedis, createJWT, (req: Request, res: Response): void => {
  res.status(200).json(res.locals.redisQueryResult)
}); // Expecting chatroom_id from frontend

// Getting userID and chatroomID routes
router.get('/chatroomID', getChatroomID, (req: Request, res: Response): void => {
  res.status(200).json(res.locals.chatroomID)
}); // Expecting chatroom_name from request

router.get('/userID', getUserID , (req: Request, res: Response): void => {
  res.status(200).json(res.locals.userID)
}); // Expecting username from request


// Route for images
router.post('/getSignedURL', getAWSURL , (req: Request, res: Response): void => {
  res.status(200).json(res.locals.url)
}); // Expecting username from request


// route just for verification, if needed
// currently just responds with a boolean if the user is verified or not
router.get('/verify', verifyJWT,
  (_req: Request, res: Response): void => {
    let variableStatus = 500;
    if (res.locals.verify) {
      variableStatus = 200;
    }
    res.status(variableStatus).json({
        username: res.locals.user.username, 
        userIdentity: {
          pictureURL: res.locals.user.pictureURL,
          email: res.locals.user.email, 
          fn: res.locals.user.fn, 
          ln: res.locals.user.ln
        },
      }
    );
  }
);

// export default router;