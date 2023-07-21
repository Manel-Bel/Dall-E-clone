import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';

dotenv.config(); //to pull envr var from dotenv file that we will create

const app = express();

app.use(cors());
app.use(express.json({limit:'50mb'}));
// we create api end point that we can hookon to from the front side
app.use('/api/v1/post',postRoutes);
app.use('/api/v1/dalle',dalleRoutes);


app.get('/', async(req,res) => {
    res.send('Hello from Dall-E');
})

const startServer = async() =>{
    try {
        connectDB(process.env.MONGODB_URL);
        app.listen(8080,() => console.log('Server has strted on port http://localhost:8080'))

    } catch (error) {
        console.log(error);
    }

}

startServer();