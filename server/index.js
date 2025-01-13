const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const authenticateAdmin = require('./middleware/authenticateAdmin');

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 5000;

require('./db/conn');

const routes = require('./router/common/routes');
const adminGetRoutes = require('./router/admin/getRoutes');
const adminPutRoutes = require('./router/admin/putRoutes');

app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);
app.use('/admin', authenticateAdmin, adminGetRoutes);
app.use('/admin', authenticateAdmin, adminPutRoutes);

app.listen(PORT, () => {
    console.log(`The server is running at port ${PORT}`);
});