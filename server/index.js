const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 5000;

require('./db/conn');

app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('./router/getRoutes'));
app.use(require('./router/postRoutes'));
app.use(require('./router/putRoutes'));

app.listen(PORT, () => {
    console.log(`The server is running at port ${PORT}`);
});