const express = require("express");
const http = require("http");
const morgan = require("morgan");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;

let clients = []

io.on("connection", (socket) => {
  console.log("New client");
  console.log(socket.id);

  clients.forEach((client) => {
    socket.emit("oldClients", client)
  })

  socket.on('message', (message) => {
    clients.push(message)
    socket.broadcast.emit("message", message)
  })

  socket.on('reset', (reset) => {
   
    clients = reset
    socket.emit('reset', clients)

  })

  socket.on("disconnect", () => {
    console.log("Client Disconnect");
  });
});

server.listen(PORT, () => {
  console.log(`server listening at port ${PORT}`);
});
