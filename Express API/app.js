const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const users = require('./usersData'); // Импортируем массив пользователей
const { Pool } = require('pg');

app.use(express.json());
app.use(bodyParser.json());

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

// Подключение к базе данных PostgreSQL
const pool = new Pool({
    user: 'admin',
    host: 'admin',
    database: 'postgresql',
    password: 'root',
    port: 5432,
});

// Разбор тела запроса в формате JSON
app.use(bodyParser.json());

// Маршрут для создания пользователя
app.post('/api/users', async (req, res) => {
    try {
        // Извлечение данных из запроса
        const { name, email } = req.body;

        // Выполнение SQL-запроса для создания пользователя
        const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
        const values = [name, email];
        const result = await pool.query(query, values);

        // Отправка успешного ответа с созданным пользователем
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating user', error);
        res.status(500).json({ error: 'Error creating user' });
    }
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
