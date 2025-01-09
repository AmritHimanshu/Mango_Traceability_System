const mongoose = require('mongoose');

const DB = process.env.DATABASE;

mongoose.connect(DB).then(() => {
    console.log("Connnection Successful");
}).catch((err) => console.log('No Connection ' + err));