
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    blogtitle:{
        type: String,
        required: true
    },
    blogcategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required: true
    },
    blogdiscription:{
        type: String,
        required: true
    },
    uploaddate:{
        type: Date,
        required: true,
        default: Date.now
    },
    image:{
        type: String
    },
    slug:{
        type: String,
        required :true,
        unique: true
    }
})

const Blog = mongoose.model('Blog',blogSchema)

module.exports = Blog