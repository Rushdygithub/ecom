const express = require('express');
const app = express();
const router = express.Router();
require('dotenv').config();
const user = require('./server/routers/user');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const {tokenVerify} = require('../APP/server/middlewares/verify');
const cookieParser = require('cookie-parser');

//NOTE:: Make DB connectivity 
mongoose.connect(process.env.MONGODB_URL, {
}).then(() => {
    console.log('Mongodb Initialled');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

//NOTE:: Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
//app.use("/web-bff", )

app.use('/',user);

app.listen(process.env.PORT || 8000, (req,error) => {
  if(error) {
    console.log("Server-Error=========",error)
  }
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});

