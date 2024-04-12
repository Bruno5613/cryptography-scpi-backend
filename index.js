const { hashText } = require("./hashing");

const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origins: ["http://localhost:4200"],
  },
});

const connectedUsers = {}; // Almacenar los usuarios conectados y sus sockets

io.on("connection", (socket) => {
  console.log("a user connected");

  // Asignar un ID de usuario al socket
  socket.on("setUserId", (userId) => {
    connectedUsers[userId] = socket;
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    // Eliminar al usuario desconectado de la lista de usuarios conectados
    for (const userId in connectedUsers) {
      if (connectedUsers[userId] === socket) {
        delete connectedUsers[userId];
        break;
      }
    }
  });

  socket.on("my message", (msg) => {
    console.log("message: " + msg);
  });

  // Manejar el evento messageToUser para enviar mensajes a un usuario específico
  socket.on("messageToUser", (data) => {
    const { userId, message } = data;
    console.log(message, hashText(message))
    const userSocket = connectedUsers[userId];
    if (userSocket) {
      userSocket.emit("new_message", message); // Enviar el mensaje al usuario específico
      console.log(`Enviado desde servidor`);
    } else {
      console.log(`Usuario con ID ${userId} no encontrado.`);
    }
  });
});

app.get("/", (req, res) => {
  res.send("<h1>Hey Socket.io</h1>");
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
