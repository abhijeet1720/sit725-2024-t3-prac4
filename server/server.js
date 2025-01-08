const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

// Create an Express application
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/tasks', require('./routes/taskRoutes'));

// Default route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Create an HTTP server and attach the Express app
const server = http.createServer(app);

// Attach Socket.IO to the HTTP server
const io = socketIo(server);

// Handle new connections with Socket.IO
io.on('connection', (socket) => {
  console.log('a user connected');

  // Emit random numbers every second
  setInterval(() => {
    socket.emit('number', parseInt(Math.random() * 10));
  }, 1000);

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Define the port for the server to listen on
const PORT = process.env.PORT || 3000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
