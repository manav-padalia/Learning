const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    categoryname:{
        type: String,
        required: true,
        unique: true,
        allowNull: false
    }
})

const Category = mongoose.model('Category',schema)

module.exports = Category