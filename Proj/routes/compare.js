const express = require('express');
const router = express.Router();

const comp_controller =  require("../controllers/comparison");

router.post('/create', comp_controller.create);

router.get('/get/all/:id', comp_controller.getAllByUserID);

router.get('/get/spotify-user/:_id/:spot_uname', comp_controller.getBySpotiUser);

router.delete('/delete/:id', comp_controller.deleteComparison);

module.exports = router;