import { Server, Socket } from "socket.io";
const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");


const secretKey = process.env.TOKEN_SECRET;

const extractUsernameFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    throw new CustomError("Invalid token", 401);
  }
};


const mountParticipantTypingEvent = (socket) => {
    socket.on('typing', (chatId) => {
      socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT, chatId);
    });
  };


  const mountParticipantStoppedTypingEvent = (socket) => {
    socket.on('stopTyping', (chatId) => {
      socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);
    });
  };


  const initializeSocketIO = (io) => {
    return io.on("connection", async (socket) => {
      try {
        const token = req.headers["authorization"]?.split(" ")[1];
  
        if (!token) {
          // Token is required for the socket to work
          throw new CustomError("token is missing!", 401);
        }
  
        const decodedToken = extractUsernameFromToken(token);
  
        //DO IT FROM HERE ONLY : YOU HAVE TO FIND OUT IF THE USER EXIST WITH THE DECODED USERNAME
        
        // const user = await User.findById(decodedToken?._id).select(
        //   "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
        // );
  
        // retrieve the user
        if (!user) {
          throw new ApiError(401, "Un-authorized handshake. Token is invalid");
        }
        socket.user = user; // mount te user object to the socket
  
        // We are creating a room with user id so that if user is joined but does not have any active chat going on.
        // still we want to emit some socket events to the user.
        // so that the client can catch the event and show the notifications.
        socket.join(user._id.toString());
        socket.emit(ChatEventEnum.CONNECTED_EVENT); // emit the connected event so that client is aware
        console.log("User connected 🗼. userId: ", user._id.toString());
  
        // Common events that needs to be mounted on the initialization
        mountJoinChatEvent(socket);
        mountParticipantTypingEvent(socket);
        mountParticipantStoppedTypingEvent(socket);
  
        socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
          console.log("user has disconnected 🚫. userId: " + socket.user?._id);
          if (socket.user?._id) {
            socket.leave(socket.user._id);
          }
        });
      } catch (error) {
        socket.emit(
          ChatEventEnum.SOCKET_ERROR_EVENT,
          error?.message || "Something went wrong while connecting to the socket."
        );
      }
    });
  };