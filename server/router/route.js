const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const cookieParser = require("cookie-parser");
router.use(cookieParser());

router.get('/', (req,res)=>{
    res.status(200).send({message: "Hi! I am Singh Sahab"});
})

module.exports = router;