const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/users');

router.post('/create', user_controller.addUser);

router.get('/get/:id', user_controller.getUserbyId);

router.delete('/delete/:id', user_controller.deleteUser);

module.exports = router;