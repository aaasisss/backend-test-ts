import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Swagger docs",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const openapiSpecs = swaggerJsdoc(options);
