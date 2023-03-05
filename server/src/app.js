
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('compression');
const cors =  require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const express = require('express')
const {signup, signin, protect} = require('./utilities/auth');
dotenv.config();

const app = express();

mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URI;

main().catch(err => console.log(err));
async function main(){
    await mongoose.connect(mongoDB);
}

const userRouter = require('./routes/userRoute')
const messageRouter = require('./routes/messageRoute')

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

app.post('/signup', signup);
app.post('/signin', signin);
app.use('/api/user', protect, userRouter);
app.use('/api/message', messageRouter);

app.get('/', (req, res, next) =>{
    res.status(200).json({message: 'Member'})
})

app.use((req, res, next) =>{
    res.status(404);
    throw new Error('Not Found');
})

module.exports = app;


