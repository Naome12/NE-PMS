import { Router } from 'express';
import { registerCarEntry ,carExit, getAllCars} from '../controllers/car.controller';
import { checkIsAdmin, isAuthenticated } from '../middleware/auth.middleware';
import { getEnteredCarsReport, getOutgoingCarsReport } from '../controllers/report.controller';

const carRouter = Router();

carRouter.post('/register', isAuthenticated, checkIsAdmin, registerCarEntry);
carRouter.post('/exit', isAuthenticated, checkIsAdmin, carExit);
carRouter.get('/outgoing', isAuthenticated, checkIsAdmin, getOutgoingCarsReport);
carRouter.get('/entered', isAuthenticated, checkIsAdmin, getEnteredCarsReport);
carRouter.get('/', isAuthenticated, checkIsAdmin, getAllCars);

export default carRouter;
