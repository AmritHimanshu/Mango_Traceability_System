const clients = [];

function addClient(client) {
    clients.push(client);
}

function removeClient(client) {
    const index = clients.indexOf(client);
    if (index !== -1) clients.splice(index, 1);
}

function sendNotificationToUser(userId, message) {
    clients.forEach(client => {
        if (client.userId === userId) {
            client.res.write(`data: ${JSON.stringify(message)}\n\n`);
        }
    });
}

module.exports = { addClient, removeClient, sendNotificationToUser };