const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const users = require('./usersData'); // ����������� ������ �������������
const { Pool } = require('pg');

app.use(express.json());
app.use(bodyParser.json());

// �������� ������ ���� �������������
app.get('/api/users', (req, res) => {
    res.json(users);
});

// �������� ������������ �� id
app.get('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// ����������� � ���� ������ PostgreSQL
const pool = new Pool({
    user: 'admin',
    host: 'admin',
    database: 'postgresql',
    password: 'root',
    port: 5432,
});

// ������ ���� ������� � ������� JSON
app.use(bodyParser.json());

// ������� ��� �������� ������������
app.post('/api/users', async (req, res) => {
    try {
        // ���������� ������ �� �������
        const { name, email } = req.body;

        // ���������� SQL-������� ��� �������� ������������
        const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
        const values = [name, email];
        const result = await pool.query(query, values);

        // �������� ��������� ������ � ��������� �������������
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating user', error);
        res.status(500).json({ error: 'Error creating user' });
    }
});

// �������� ������������ �� id
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

// ������� ������������ �� id
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
