const mongoose = require('mongoose')
const User = require('./User')
const Restaurant = require('./Restaurant')

const ReservationSchema = new mongoose.Schema(
    {
     reservationDate:{
         type: Date,
         required: true
     }, 
    numberOfSeats:{
        type: Number,
        required: true
    },
    comment:{
        type: String,
        required: true,
        default: 'Nėra'
    },
    status:
    {
        type: String,
        enum: ['Atmesta','Priimta', 'Peržiūrima'],
        default: 'Peržiūrima'
    },
    user:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    restaurant:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    },
    restaurantName:
    {
        type: String,
        required: true
    },
    userName:
    {
        type: String,
        required: true
    }
    }
)

const Reservation = mongoose.model('Reservation',ReservationSchema);

module.exports = Reservation;