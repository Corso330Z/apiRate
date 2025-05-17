// swaggerConfig.js
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API do Rate',
        version: '1.0.1',
        description: 'Documentação da API com Swagger',
        
    },
    servers: [
        {
            url: 'http://localhost:9000',
            description: 'Servidor local',
        },
        {
            url: 'https://rate.dev.vilhena.ifro.edu.br/api/',
            description: 'Servidor Online',
        }
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./*/rotas/*.js']
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
