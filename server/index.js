const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const authenticateAdmin = require('./middleware/authenticateAdmin');
const authenticateFarmer = require('./middleware/authenticateFarmer');

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 5000;

require('./db/conn');

const routes = require('./router/common/routes');
const adminGetRoutes = require('./router/admin/getRoutes');
const adminPutRoutes = require('./router/admin/putRoutes');
const farmerGetRoutes = require('./router/farmer/getRoutes');
const farmerPostRoutes = require('./router/farmer/postRoutes');
const farmerPutRoutes = require('./router/farmer/putRoutes');
const farmerDeleteRoutes = require('./router/farmer/deleteRoutes');

app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/admin', authenticateAdmin, adminGetRoutes);
app.use('/admin', authenticateAdmin, adminPutRoutes);

app.use('/farmer', authenticateFarmer, farmerGetRoutes);
app.use('/farmer', authenticateFarmer, farmerPostRoutes);
app.use('/farmer', authenticateFarmer, farmerPutRoutes);
app.use('/farmer', authenticateFarmer, farmerDeleteRoutes);

app.use(routes);

app.listen(PORT, () => {
    console.log(`The server is running at port ${PORT}`);
});