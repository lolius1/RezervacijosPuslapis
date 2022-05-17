const mongoose = require('mongoose')
const Reservation = require('./Reservation')

const RestaurantSchema = new mongoose.Schema(
    {
     name:{
         type: String,
         required: true
     }, 
     address:{
        type: String,
        required: true
    }, 
    description:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    }, 
    workStart:{
        type: Date,
        required: true
    }, 
    workEnd:{
        type: Date,
        required: true
    }, 
    contacts:{
        type: String,
        required: true
    }, 
    numberOfSeats:{
        type: Number,
        required: true
    }, 
    seatRestriction:{
        type: Number
    }, 
    sicknessRestriction:{
        type: Boolean,
        default: false
    }, 
    outsideRestriction:{
        type: Boolean,
        default: false
    }
    }
)

const Restaurant = mongoose.model('Restaurant',RestaurantSchema);

module.exports = Restaurant;