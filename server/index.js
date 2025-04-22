const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);

const cron = require('node-cron');
const { runWeatherAlertJob, sendInstantAlertToUser } = require('./notification/weatherAlerts.js');

const authenticateAdmin = require('./middleware/authenticateAdmin');
const authenticateFarmer = require('./middleware/authenticateFarmer');
const routes = require('./router/common/routes');
const adminGetRoutes = require('./router/admin/getRoutes');
const adminPutRoutes = require('./router/admin/putRoutes');
const adminDeleteRoutes = require('./router/admin/deleteRoutes');
const farmerGetRoutes = require('./router/farmer/getRoutes');
const farmerPostRoutes = require('./router/farmer/postRoutes');
const farmerPutRoutes = require('./router/farmer/putRoutes');
const farmerDeleteRoutes = require('./router/farmer/deleteRoutes');

app.use(cookieParser());

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 5000;

require('./db/conn');

app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true,
    }
});

const connectedUsers = new Map();

io.on('connection', (socket) => {
    console.log('⚡ A user connected:', socket.id);

    socket.on('identify', async (userId) => {
        console.log(`👤 User ${userId} identified.`);
        connectedUsers.set(userId, socket.id);

        await sendInstantAlertToUser(userId);
    });

    socket.on('disconnect', () => {
        console.log(`🔌 User disconnected: ${socket.id}`);
        for (const [userId, socketId] of connectedUsers.entries()) {
            if (socketId === socket.id) {
                connectedUsers.delete(userId);
                break;
            }
        }
    });
});

app.set('io', io);
app.set('connectedUsers', connectedUsers);

app.use('/admin', authenticateAdmin, adminGetRoutes);
app.use('/admin', authenticateAdmin, adminPutRoutes);
app.use('/admin', authenticateAdmin, adminDeleteRoutes);

app.use('/farmer', authenticateFarmer, farmerGetRoutes);
app.use('/farmer', authenticateFarmer, farmerPostRoutes);
app.use('/farmer', authenticateFarmer, farmerPutRoutes);
app.use('/farmer', authenticateFarmer, farmerDeleteRoutes);

app.use(routes);

cron.schedule('* * * * *', () => {
    console.log('🌤️ Running weather alert job...');
    runWeatherAlertJob();
});

server.listen(PORT, () => {
    console.log(`🚀 Server running on ports ${PORT}`);
});

global.appInstance = app;