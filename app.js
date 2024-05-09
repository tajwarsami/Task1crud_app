// 1. Set up the project
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// 2. Define the task model
let tasks = [];
let taskIdCounter = 1;

// 3. Implement routes for CRUD operations
// Create a new task
app.post('/tasks', (req, res) => {
    const { title, description, status } = req.body;
    if (!title || !status) {
        return res.status(400).json({ error: 'Title and status are required' });
    }
    const newTask = {
        id: taskIdCounter++,
        title,
        description: description || '',
        status
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Read all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Update a task
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { title, description, status } = req.body;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    if (!title || !status) {
        return res.status(400).json({ error: 'Title and status are required' });
    }
    tasks[taskIndex] = { ...tasks[taskIndex], title, description: description || '', status };
    res.json(tasks[taskIndex]);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    tasks.splice(taskIndex, 1);
    res.sendStatus(204);
});

// 4. Implement error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong' });
});

// 5. Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
