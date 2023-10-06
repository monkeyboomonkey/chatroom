import express from 'express';
import { getAllUsers } from '../controllers/chatRoomControllers.js'
const router = express.Router();

router.get('/getusers', getAllUsers, (req, res) => res.status(200).json(res.locals.allUsers));

export default router;