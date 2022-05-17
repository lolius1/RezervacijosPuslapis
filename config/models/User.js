const mongoose = require('mongoose')
const Restaurant = require('./Restaurant')
const Reservation = require('./Reservation')

const UserSchema = new mongoose.Schema(
    {
     username:{
         type: String,
         required: true
     }, 
     email:{
        type: String,
        required: true
    }, 
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    }, 
    password:{
        type: String,
        required: true
    },
    type:{
        type: String,
        enum: ['Registered user','Restaurant administrator'],
        default: "Registered user"
    },
    responsibleRestaurant:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    }

    }
)

const User = mongoose.model('User',UserSchema);

module.exports = User;