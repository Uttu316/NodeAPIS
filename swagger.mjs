import app from "./app.mjs";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const port = process.env.PORT || 8000;

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Node APIS",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ["./*.mjs"],
};

const specs = swaggerJsdoc(options);

const swaggerConfig = [swaggerUi.serve, swaggerUi.setup(specs,{
  explorer:true
})];
export default swaggerConfig;
