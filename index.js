'use strict'
const express = require("express");
const app = express();
const dbService = require("./src/services/db/db.service");
const port = 3000;
const morgan = require('morgan')
const bodyParser = require('body-parser')
const createAdminDefault = require('./src/controllers/users/admin.controller')
const authRoutes = require('./src/routes/auth.routes')
const productsRoutes = require('./src/routes/products.routes')
const categoryRoutes = require('./src/routes/category.routes');
const adminRoutes = require('./src/routes/admin.routes');
const userRoutes = require('./src/routes/users.routes')
const recipeRoutes = require('./src/routes/recipe.routes')
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
// Views
app.set('view engine', 'ejs');
app.set('views', './src/utils/views');
//Routes
app.use('/products', productsRoutes)
app.use('/categories', categoryRoutes)
app.use('/login', authRoutes)
app.use('/admin', adminRoutes)
app.use('/user', userRoutes)
app.use('/purchase', recipeRoutes)
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

