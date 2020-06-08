import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

import routes from './src/routes';
const PORT = process.env.PORT || 3000;

const app = express()

//Connecting static components
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views'));
app.use(express.json())

//  Connect all our routes to our application
app.use('/', routes);

// Turn on that server!
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});