import express from 'express';
import {
  registerPark,
  getParks,
  getAvailableParks,
} from '../controllers/parking.controller';
import { isAuthenticated, checkIsAdmin } from '../middleware/auth.middleware';

const parkRouter = express.Router();

parkRouter.post('/', isAuthenticated, checkIsAdmin, registerPark);
parkRouter.get('/', isAuthenticated, getParks);
parkRouter.get('/available', isAuthenticated, getAvailableParks);

export default parkRouter;
