const { raw } = require('express');
const course = require('../models/course');
const Course = require('../models/course');

const allCourses = async (req, res) => {
    const courses = await Course.findAll({
        raw: true
    }).catch(error => console.log(error));
    console.log(courses)
    await res.render('home', { data : courses })
}

const courseForm = async (req, res) => {
    await res.render('create')
}

const saveCourse = async (req, res) => {
    console.log(req.body);
    const { name, duration, fees } = await req.body;
    const course = await Course.create({
        Course_name: name, Duration: duration, Fees: fees
    }).catch(error => console.log(error))
    console.log(Course);
    await res.redirect('/');


    //await res.render('create')

}
const editCourse = async (req, res) => {
    // console.log(req.params)
    const { id } = await req.params;
    const course = await Course.findOne({
        where: {
            id: id
        },
        raw : true
    }).catch(error => console.log(error))
    // console.log(course);
    res.render('edit', { data : course })
}

const updateCourse = async (req, res) => {
    // console.log(req.params)
    const { id } = req.params;
    const data = req.body;
    const selector = { where: { id: id } }
    await Course.update(data, selector).catch(error => console.log(error));
    // console.log(req.params)
    res.redirect('/')
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = await Course.destroy({
        where: {
            id: id
        },
        raw: true
    }).catch(error => console.log(error));
    // await user.destroy();


    res.redirect('/')
}

module.exports = {
    allCourses, courseForm, saveCourse, editCourse, updateCourse, deleteUser
}