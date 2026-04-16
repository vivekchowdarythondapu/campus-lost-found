const Message = require('../models/Message');
const Notification = require('../models/Notification');
const { sendMessageEmail } = require('../services/emailService');
const User = require('../models/User');

const connectedUsers = {};

const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User joins with their userId
    socket.on('join', (userId) => {
      connectedUsers[userId] = socket.id;
      socket.join(userId);
      console.log(`User ${userId} joined`);
    });

    // Handle sending messages
    socket.on('sendMessage', async (data) => {
      try {
        const { sender, receiver, message, item } = data;

        const newMessage = await Message.create({
          sender,
          receiver,
          message,
          item: item || null
        });

        const populated = await Message.findById(newMessage._id)
          .populate('sender', 'name email')
          .populate('receiver', 'name email');

        // Send to receiver if online
        io.to(receiver).emit('receiveMessage', populated);
        io.to(sender).emit('receiveMessage', populated);

        // Create notification
        await Notification.create({
          user: receiver,
          title: 'New Message',
          message: `You have a new message`,
          type: 'message'
        });

        io.to(receiver).emit('notification', {
          title: 'New Message',
          message: `You have a new message`
        });
      } catch (error) {
        console.error('Socket message error:', error);
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      socket.to(data.receiver).emit('userTyping', data.sender);
    });

    socket.on('stopTyping', (data) => {
      socket.to(data.receiver).emit('userStopTyping', data.sender);
    });

    socket.on('disconnect', () => {
      Object.keys(connectedUsers).forEach(userId => {
        if (connectedUsers[userId] === socket.id) {
          delete connectedUsers[userId];
        }
      });
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = { initSocket };