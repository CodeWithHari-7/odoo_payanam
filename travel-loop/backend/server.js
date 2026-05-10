const app = require('./src/app');
const http = require('http');

// Get port from environment and store in Express.
const port = process.env.PORT || 5000;
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
