const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

//for healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'todo-backend'
  });
});

// Connect to MongoDB
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://mongodb:27017/todoapp';
mongoose.connect(MONGODB_URL)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    console.log('Database URL:', MONGODB_URL);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });

// Todo model
const Todo = mongoose.model('Todo', {
  text: String,
  completed: Boolean
});

// Routes
app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/api/todos', async (req, res) => {
  const todo = new Todo(req.body);
  await todo.save();
  res.json(todo);
});

app.patch('/api/todos/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (req.body.text) todo.text = req.body.text;
  if (req.body.completed !== undefined) todo.completed = req.body.completed;
  await todo.save();
  res.json(todo);
});

app.delete('/api/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

app.listen(5000, () => console.log('Backend running on port 5000'));