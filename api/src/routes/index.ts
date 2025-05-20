import { Router } from 'express';
import authRouter from './auth.route';
import parkingRouter from './parking.route';
import carRouter from './car.route';
import ticketRouter from './ticket.route';

const router = Router();

router.use('/auth', authRouter
  /*
    #swagger.tags = ['Auth']
    #swagger.security = [{
      "bearerAuth": []
    }]
  */
);

router.use('/park', parkingRouter
  /*
    #swagger.tags = ['Parks']
    #swagger.security = [{
      "bearerAuth": []
    }]
  */
);

router.use('/car', carRouter
  /*    
      #swagger.tags = ['Cars']
    #swagger.security = [{
      "bearerAuth": []
    }]
  */
);
// router.use('/ticket', ticketRouter
//   /*    
//       #swagger.tags = ['Tickets']
//     #swagger.security = [{
//       "bearerAuth": []
//     }]
//   */
// );

export default router;
