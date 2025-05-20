import swaggerAutogen from 'swagger-autogen';

const doc = {
  openapi: '3.0.0',
  info: {
    title: 'Parking Management API',
    description: 'API documentation for the parking management system',
    version: '1.0.0',
  },
  host: 'localhost:4000',
  schemes: ['http'],
  basePath: "/api",
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "Auth",
      description: "Authentication endpoints",
    },
    {
      name: "Parking Spots",
      description: "Parking Spots endpoints",
    },
  ],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },
  security: [{
    bearerAuth: [],
  }],
};

const outputFile = './doc/swagger.json'; // File where swagger doc will be written
const endpointsFiles = ['./src/routes/index.ts']; // Your main app or entry point (can include more)

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc).then(() => {
  console.log(' Swagger documentation generated successfully!');
});
