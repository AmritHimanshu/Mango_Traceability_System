const express = require('express');
const router = express.Router();
const cookieParser = require("cookie-parser");
router.use(cookieParser());


router.post('/api/', async(req,res)=>{
    
})

module.exports = router;