function sendNotificationToUser(userId, message, app) {
    const io = app.get('io');
    const connectedUsers = app.get('connectedUsers');

    const socketId = connectedUsers.get(userId);
    if (socketId) {
        io.to(socketId).emit('notification', {
            userId,
            message,
            createdAt: new Date(),
        });
    } else {
        console.log(`User ${userId} is not connected via WebSocket.`);
    }
}

module.exports = { sendNotificationToUser };