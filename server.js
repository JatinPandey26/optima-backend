const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const router = require('./route.js');
const connectToMongoDb = require('./mongoConnection.js');

dotenv.config();

connectToMongoDb()

const app = express();
app.use(express.json())
app.use(cors())

app.use(router)




const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});