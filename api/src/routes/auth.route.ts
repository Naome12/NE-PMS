import { Router } from 'express';
import { signup, login, getAllUsers, logout, getAttendants, getCurrentUser } from '../controllers/auth.controller';
import { checkIsAdmin, isAuthenticated } from '../middleware/auth.middleware';

const authRouter = Router();


authRouter.get('/',isAuthenticated, checkIsAdmin,getAllUsers)
authRouter.post('/signup', signup );
authRouter.post('/login',login);
authRouter.post('/logout', logout);
authRouter.get('/attendants', isAuthenticated, checkIsAdmin, getAttendants);
authRouter.get('/:me', isAuthenticated, getCurrentUser)


export default authRouter;
