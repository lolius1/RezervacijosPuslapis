const path = require('path');
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')

// Load config
dotenv.config({ path: './config/config.env' })

//Connecting to mongo
connectDB()

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//Loggin about requests
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//Routes
app.use('/', require('./routes/index'))


const PORT = process.env.PORT || 3000

app.listen(PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)