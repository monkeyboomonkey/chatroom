import express from 'express';
import { getAllUsers } from '../controllers/chatRoomControllers.js'
const router = express.Router();

router.post('/createuser', getAllUsers, (req, res) => res.status(200).json(res.locals.allUsers));
