import { Router } from 'express';
import { registerCarEntry ,carExit, getAllCars, getExitedCars, getCarsStillParked} from '../controllers/car.controller';
import { checkIsAdmin, isAuthenticated } from '../middleware/auth.middleware';

const carRouter = Router();

carRouter.post('/register', isAuthenticated, registerCarEntry);
carRouter.post('/exit', isAuthenticated, checkIsAdmin, carExit);
carRouter.get('/outgoing', isAuthenticated, checkIsAdmin, getExitedCars);
carRouter.get('/entered', isAuthenticated, checkIsAdmin, getCarsStillParked);
carRouter.get('/', isAuthenticated, checkIsAdmin, getAllCars);

export default carRouter;
