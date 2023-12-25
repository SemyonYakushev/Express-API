const express = require('express');
const app = express();
const port = 3000;
const { Pool } = require('pg');

// Подключение к базе данных PostgreSQL
const pool = new Pool({
    user: 'admin',
    host: '127.0.0.1',
    database: 'postgres',
    password: 'root',
    port: 5432,
});

app.use(express.json());

// Пример базы данных
let users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Bob' }
];

// Получить список всех пользователей
app.get('/api/users', (req, res) => {
    res.json(users);
});

// Получить пользователя по id
app.get('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Добавить нового пользователя
app.post('/api/users', (req, res) => {
    const user = req.body;
    users.push(user);
    res.status(201).json(user);
});

// Обновить пользователя по id
app.put('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);

    if (user) {
        user.name = req.body.name;
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Удалить пользователя по id
app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        const deletedUsers = users.splice(index, 1);
        res.json(deletedUsers[0]);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
