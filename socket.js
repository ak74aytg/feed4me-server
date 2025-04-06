const Message = require('./models/messageSchema')
const ChatRoom = require('./models/chatRoomSchema')

module.exports = (io) =>{
    io.on('connection', (socket)=>{
        console.log("New user connected:", socket.id);

        // JOIN A PRIVATE CHAT ROOM
        socket.on('joinRoom',async ({senderId, recieverId})=>{
            const roomID = [senderId, recieverId].sort().join("-");
            socket.join(roomID);
            // may be it is like socket.roomId = roomID
            socket.roomID = roomID;
            console.log(`${senderId} joined room: ${roomID}`)
            const isPresent = await ChatRoom.findOne({ roomId : roomID })
            console.log(isPresent)
            if(!isPresent){
                await ChatRoom.create({roomId : roomID, participants: [senderId, recieverId]});
            }
        })

        // LISTEN FOR MESSAGES
        socket.on('sendMessage', async ({senderId, recieverId, message}) =>{
            const roomID = [senderId, recieverId].sort().join("-");
            const payload = {
                senderId, 
                recieverId, 
                message,
                timestamp : new Date()
            }
            const chatList = await ChatRoom.findOne({ roomId : roomID })
            chatList.lastMessage = message;
            await chatList.save();
            // EMIT THE MESSAGE TO EVERYONE IN THE ROOM (SENDER + RECIEVER)
            io.to(roomID).emit('receiveMessage', payload);
            console.log(`Message from ${senderId} to ${recieverId}: ${message}`);
            const newMessage = new Message({ roomId : String(roomID),senderId, receiverId : recieverId, message });
            console.log(newMessage)
            await newMessage.save();
        })

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    })
}