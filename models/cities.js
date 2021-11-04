var mongoose = require('mongoose')

var citySchema = mongoose.Schema({
    depart: String,
    arrival: String,
    date: Date,
})

var cityModel = mongoose.model('cities', citySchema)
module.exports = cityModel;