const express = require('express');
const bodyParser = require('body-parser');


const fs = require('fs');


const app = express();
app.use(bodyParser.json());

let tasks = JSON.parse(fs.readFileSync('tasks.json'));


// Create a new task
app.post('/tasks', (req, res) => {
    const { title, description, status } = req.body;
    if (!title || !status) {
        return res.status(400).json({ error: 'Title and status are required' });
    }
    const newTask = {
        id: tasks.length + 1,
        title,
        description: description || '',
        status
    };
   
    tasks.push(newTask);
    fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
    res.status(201).json(newTask);
});


app.get('/tasks', (req, res) => {
    res.json(tasks);
});


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
    fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
    res.json(tasks[taskIndex]);
});


app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    tasks.splice(taskIndex, 1);
    fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
    res.sendStatus(204);
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
