const express = require('express');
const router = express.Router()
const {allCourses, courseForm, saveCourse, editCourse, updateCourse, deleteUser} = require('../controllers/coursecontrollers')

router.get('/', allCourses)
router.get('/create', courseForm)
router.post('/create', saveCourse)
// router.post('/edit/:id', editCourse)
router.get('/edit/:id', editCourse)
router.post('/update/:id', updateCourse)
// router.post('/update/:id', updateCourse)
router.get('/delete/:id', deleteUser)


module.exports = router;