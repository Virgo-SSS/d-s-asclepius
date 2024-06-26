require('dotenv').config(); // Load .env file

const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');

(async () => {
    const server = Hapi.server({
        port: 3000,
        host: process.env.ENV === 'production' ? '0.0.0.0' : 'localhost',
        routes: {
            cors: {
              origin: ['*'],
            },
        },
    })

    server.route(routes);
    
    const model = await loadModel();
    server.app.model = model;


    server.ext('onPreResponse', function (request, h) {
        const response = request.response;
        
        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: `${response.message}`
            })

            newResponse.code(response.statusCode)
            return newResponse;
        }

        
        if (response.isBoom) {
            const payload = {
                status: 'fail',
                message: response.message
            };
            
            if(response.output.payload.error == 'Request Entity Too Large') {
                payload.message = 'Payload content length greater than maximum allowed: 1000000';
            }
            
            const newResponse = h.response(payload)
            newResponse.code(response.output.statusCode)
            return newResponse;
        }

        return h.continue;
    });

    await server.start();
    console.log(`Server start at: ${server.info.uri}`);
})();