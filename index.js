'use strict'
const express = require("express");
const app = express();
const dbService = require("./src/services/db/db.service");
const port = 3000;
const morgan = require('morgan')
const bodyParser = require('body-parser')
const createAdminDefault = require('./src/controllers/users/admin.controller')
// Start App
const startServer = (port) => {
    app.listen(port, () => {
      console.log(`App listening in port ${port}`);
    });
  };
// Body Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
// MiddleWares
app.use(morgan('dev'))
//Routes

// Start DB
dbService
  .connectToDb()
  .then((resolved) => {
    if (resolved) {
      console.log(resolved);
      startServer(port);
      createAdminDefault.createDefault({
        name: 'Admin',
        email: 'admin@admin.com',
        userName: 'ADMIN',
        password: '123456'
      })
    }
  })
  .catch((err) => {
    console.error(err);
  });

