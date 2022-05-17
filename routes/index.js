const dotenv = require('dotenv')
const morgan = require('morgan')
const express = require('express')
const User = require('../config/models/User')
const router = express.Router()
const bodyParser = require('body-parser')
const Reservation = require('../config/models/Reservation')
const Restaurant = require('../config/models/Restaurant')
const bcrypt = require('bcrypt')
const initializePassport = require('./passport-config')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const {
    default: mongoose
} = require('mongoose');

dotenv.config({
    path: './config/config.env'
})
if (process.env.NODE_ENV === 'development') {
    router.use(morgan('dev'))
}

router.use(bodyParser.json());
router.use(flash())
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
router.use(passport.initialize())
router.use(passport.session())

initializePassport(passport,
    username => User.findOne({
        username: username
    }),
    id => User.findOne({
        id: id
    })
)

// @desc Login page
// @route GET /
router.get('/Login', (req, res) => {
    res.render('login')
})

// @desc Login request
// @route POST /
router.post('/Login', passport.authenticate('local', {
    successRedirect: '/Restaurants',
    failureRedirect: '/login',
    failureFlash: true
}))

// @desc Landing page
// @route GET /
router.get('/Restaurants', (req, res) => {

    Restaurant.find({}, function (err, restaurants) {
        res.render('indexLogged', {
            restaurantsList: restaurants,
        })
    })
})


// @desc Registration page
// @route GET /
router.get('/Register', (req, res) => {
    res.render('register')
})

router.post('/Register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const data = new User({
            username: req.body.username,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hashedPassword
        })
        const val = await data.save();
    } catch {
        res.redirect('Register')
    }
})

// @desc Reservation page
// @route GET /
router.get('/Reservation', async (req, res) => {
    res.render('reservation')
})

// @desc Restaurant creation page
// @route GET /
router.get('/Restaurant', (req, res) => {
    res.render('restaurantCreation')
})

// @desc Restaurant update page
// @route GET /
router.get('/RestaurantUpdate', async (req, res) => {
    const user = await User.findById(req.session.passport.user)
    Restaurant.findById(user.responsibleRestaurant
    , function (err, restaurant) {
        res.render('restaurantUpdate', {
            restaurant: restaurant,
        })
    })
})


// @desc Restaurant update page
// @route POST /
router.post('/RestaurantUpdate', async (req, res) => {
    const user = await User.findById(req.session.passport.user)
    console.log(user)
    await Restaurant.findByIdAndUpdate(user.responsibleRestaurant, {
        name: req.body.name,
        address: req.body.address,
        description: req.body.description,
        category: req.body.category,
        workStart: req.body.workStart,
        workEnd: req.body.workEnd,
        contacts: req.body.contacts,
        numberOfSeats: req.body.numberOfSeats
    })
})

// @desc User update page
// @route GET /
router.get('/UserUpdate', async (req, res) => {
    User.findById(req.session.passport.user
    , function (err, user) {
        res.render('userUpdate', {
            user: user,
        })
    })
})


// @desc Restaurant update page
// @route POST /
router.post('/UserUpdate', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    await User.findByIdAndUpdate(req.session.passport.user, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
    })
})


// @desc Landing page
// @route GET /
router.get('/', (req, res) => {
    Restaurant.find({}, function (err, restaurants) {
        res.render('index', {
            restaurantsList: restaurants
        })
    })
})

// @desc Active reservations page
// @route GET /
router.get('/ActiveReservations', (req, res) => {
    Reservation.find({
        user: req.session.passport.user
    }, function (err, reservations) {
        reservations = reservations.reverse()
        res.render('activeReservations', {
            reservationsList: reservations
        })
    })
})

// @desc Accept reservations page
// @route GET /
router.get('/ReservationStatus', async (req, res) => {
    const user = await User.findById(req.session.passport.user)
    Reservation.find({
        restaurant: user.responsibleRestaurant
    }, function (err, reservations) {
        res.render('reservationAccept', {
            reservationsList: reservations
        })
    })
})

// @desc Accept reservations page
// @route Post /
router.post('/ReservationStatus', async (req, res) => {
    await Reservation.findByIdAndUpdate(req.body.resId, {
        status: req.body.status
    })
})

// @desc Restaurant creation page
// @route Post /
router.post('/Restaurant', async (req, res) => {
    const data = new Restaurant({
        name: req.body.name,
        address: req.body.address,
        description: req.body.description,
        category: req.body.category,
        workStart: req.body.workStart,
        workEnd: req.body.workEnd,
        contacts: req.body.contacts,
        numberOfSeats: req.body.numberOfSeats
    })
    await User.findByIdAndUpdate(req.session.passport.user, {
        type: "Restaurant administrator",
        responsibleRestaurant: data
    })
    const val = await data.save();
    res.json(val);
})


// @desc Reservation page
// @route Post /
router.post('/Reservation', async (req, res) => {
    const restaurant = await Restaurant.findOne({
        name: req.body.resName
    })
    const user = await User.findById(req.session.passport.user)
    const userName = user.firstName + " " + user.lastName 
    if(restaurant.numberOfSeats < req.body.numberOfSeats)
    {
        console.log("Per daug")
    }
    else{
    const data = new Reservation({
        reservationDate: req.body.reservationDate,
        numberOfSeats: req.body.numberOfSeats,
        comment: req.body.comment,
        restaurant: restaurant,
        user: req.session.passport.user,
        restaurantName: restaurant.name,
        userName: userName
    })
    const val = await data.save();
    res.json(val);
    }
})

// @desc Register request
// @route POST /
// router.post('/register', async(req, res) => {
//     const data = new User({
//         username: req.body.username,
//         email: req.body.email,
//         firstName: req.body.firstName,
//         password: req.body.password
//     })
//     const val = await data.save();
//     res.json(val);
// })

module.exports = router