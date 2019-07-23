var express = require('express');
const path = require('path');
const swagger = require('swagger-express-middleware');
const Middleware = swagger.Middleware;
const MemoryDataStore = swagger.MemoryDataStore;
const Resource = swagger.Resource;
const swaggerUi = require('swagger-ui-express');

var app = express();
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); 
 
let swaggerFile = path.join(__dirname, 'swagger.json');
let myDB = new MemoryDataStore();
myDB.save(
    new Resource('/api/v1/account/getuserinfo', {name: 'Lassie', type: 'dog'}),
);

let middleware = new Middleware(app);
middleware.init(swaggerFile, function(err, middleware) {
  console.log(err);
    // Add all the Swagger Express Middleware, or just the ones you need.
    // NOTE: Some of these accept optional options (omitted here for brevity)
    app.use(
        middleware.metadata(),
        middleware.CORS(),
        middleware.files(),
        middleware.parseRequest(),
        middleware.validateRequest(),
        middleware.mock(myDB)
    );
 
    app.listen(3301, function() {
        console.log('The PetStore sample is now running at http://localhost:3301');
    });
});