const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MongoDB URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

const mongoose = require('mongoose');

const MessageResponderSchema = new mongoose.Schema({
  text_received: { type: String, required: true },
  response_by_bot: { type: String, required: true },
  botid: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('MessageResponder', MessageResponderSchema);


// Routes
const instrumentRoutes = require('./routes/instrumentRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const renterRoutes = require('./routes/renterRoutes');

app.use('/api/instruments', instrumentRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/renters', renterRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Get all messages
router.get('/', async (req, res) => {
  try {
    const messages = await MessageResponder.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new message
router.post('/', async (req, res) => {
  const { text_received, response_by_bot, botid } = req.body;
  try {
    const newMessage = new MessageResponder({ text_received, response_by_bot, botid });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// View a single message
router.get('/:id', async (req, res) => {
  try {
    const message = await MessageResponder.findById(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a message
router.put('/:id', async (req, res) => {
  try {
    const updated = await MessageResponder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a message
router.delete('/:id', async (req, res) => {
  try {
    await MessageResponder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
