import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import postsRoute from './routes/posts.js';
import usersRoute from './routes/users.js';

const app = express();
dotenv.config();

app.use(bodyParser.json({limit:"30mb", extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb", extended:true}));
app.use(cors());
app.use('/posts', postsRoute);
app.use('/users', usersRoute);


// const CONNECTION_URL = 'mongodb+srv://admin:admin@cluster0.9brw8.mongodb.net/nodeJs?retryWrites=true&w=majority';

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, {useNewUrlParser:true, useUnifiedTopology:true})
    .then(()=> app.listen(PORT,()=> console.log(`Server running on port: ${PORT}`)))
    .catch((error)=> console.log(error.message));

// mongoose.set('useFindAndModify', false);    
