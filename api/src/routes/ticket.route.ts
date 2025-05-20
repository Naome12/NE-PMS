import { Router } from 'express';
import {
  bookTicket,
  approveTicket,
  rejectTicket,
  getAllTickets,
  getTicketById
} from '../controllers/ticket.controller';
import {
  isAuthenticated,
  checkIsAdminOrOperator
} from '../middleware/auth.middleware';

const ticketRouter = Router();

ticketRouter.post('/book', isAuthenticated, bookTicket); 
ticketRouter.patch('/approve/:id', isAuthenticated, checkIsAdminOrOperator, approveTicket);
ticketRouter.patch('/reject/:id', isAuthenticated, checkIsAdminOrOperator, rejectTicket);
ticketRouter.get('/',isAuthenticated,checkIsAdminOrOperator ,getAllTickets); 
ticketRouter.get('/:id',isAuthenticated,checkIsAdminOrOperator , getTicketById);

export default ticketRouter;
