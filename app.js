// Core modules
const express = require('express');
const cors = require('cors');


// Express app / middleware
const app = express();
app.use(express.static(`${__dirname}/static`));

// Allow CORS requests locally
if (!process.env.PORT) {
  app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true 
  }));
}

// Bug Bash Routes
require('./routes.js')(app);

app.listen(3000, () => {
  console.log('App running on port 3000...');
});
