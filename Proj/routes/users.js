const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/users');

router.post('/create', user_controller.addUser);

router.get('/get/:uname', user_controller.getUserbyUname);

router.delete('/delete/:id', user_controller.deleteUser);

module.exports = router;