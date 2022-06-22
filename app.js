const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRouter = require('./routes/auth');

const app = express();
dotenv.config();


// middleware
app.use(express.json());
app.use('/api/auth', authRouter);

mongoose.connect(process.env.dbURI, { useNewUrlParser: true });    // connect to database
const db = mongoose.connection;

db.on("error", (err) =>{console.error(err);});
db.once("open", ()=>{console.log("DB started successfully")})


app.listen(3000, () => {
  console.log('listening on port 3000');
})
   