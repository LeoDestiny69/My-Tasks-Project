// backend/index.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); 
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Database connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST, 
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test DB connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log('Database connected successfully:', result.rows[0].now);
  });
});

// API Routes

// GET all todos
app.get('/api/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC'); 
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a single todo by ID
app.get('/api/todos/:id', async (req, res) => { // <-- แก้ไข: เพิ่ม /api
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching todo by ID:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST a new todo
app.post('/api/todos', async (req, res) => { // <-- แก้ไข: เพิ่ม /api
  const { title, description, due_date, priority } = req.body;
  
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required and must be a non-empty string.' });
  }
  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ error: 'Description must be a string.' });
  }
  if (due_date !== undefined && due_date !== null) {
      if (isNaN(new Date(due_date))) {
          return res.status(400).json({ error: 'Invalid due_date format.' });
      }
  }
  if (priority !== undefined && !['Low', 'Medium', 'High'].includes(priority)) {
      return res.status(400).json({ error: 'Priority must be Low, Medium, or High.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO todos (title, description, due_date, priority) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description || null, due_date || null, priority || 'Medium'] 
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating todo:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT (update) an existing todo
app.put('/api/todos/:id', async (req, res) => { // <-- แก้ไข: เพิ่ม /api
  const { id } = req.params;
  
  const { title, description, is_completed, due_date, priority } = req.body;

  try {
    const existingTodo = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
    if (existingTodo.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    const oldTodo = existingTodo.rows[0];

    const updatedTitle = title !== undefined ? title : oldTodo.title;
    const updatedDescription = description !== undefined ? description : oldTodo.description;
    const updatedIsCompleted = is_completed !== undefined ? is_completed : oldTodo.is_completed;
    const updatedDueDate = due_date !== undefined ? due_date : oldTodo.due_date;
    const updatedPriority = priority !== undefined ? priority : oldTodo.priority;

    if (updatedTitle === null || (typeof updatedTitle === 'string' && updatedTitle.trim() === '')) {
        return res.status(400).json({ error: 'Title cannot be empty.' });
    }
    if (updatedDescription !== null && updatedDescription !== undefined && typeof updatedDescription !== 'string') {
        return res.status(400).json({ error: 'Description must be a string or null.' });
    }
    if (updatedIsCompleted !== undefined && typeof updatedIsCompleted !== 'boolean') {
        return res.status(400).json({ error: 'is_completed must be a boolean.' });
    }
    if (updatedDueDate !== undefined && updatedDueDate !== null) {
        if (isNaN(new Date(updatedDueDate))) {
            return res.status(400).json({ error: 'Invalid due_date format.' });
        }
    }
    if (updatedPriority !== undefined && !['Low', 'Medium', 'High'].includes(updatedPriority)) {
        return res.status(400).json({ error: 'Priority must be Low, Medium, or High.' });
    }

    const result = await pool.query(
      'UPDATE todos SET title = $1, description = $2, is_completed = $3, due_date = $4, priority = $5 WHERE id = $6 RETURNING *',
      [updatedTitle, updatedDescription, updatedIsCompleted, updatedDueDate, updatedPriority, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating todo:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE a todo
app.delete('/api/todos/:id', async (req, res) => { // <-- แก้ไข: เพิ่ม /api
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(204).send(); 
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Backend server listening at ${port}`);
});