import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger/doc/swagger.json';
import parkingRouter from './routes/parking.route';
import authRouter from './routes/auth.route';
import router from './routes';

dotenv.config();

const app = express();


    app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
    }));
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Parking Management System API Documentation",
  customfavIcon: "/favicon.ico"
}));

// Routes
app.use('/', router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});

export default app;
