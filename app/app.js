const express = require('express')
const mysql = require('mysql');
const app = express();
app.disable('x-powered-by');
const path = require('path')
require('dotenv').config();

// Import Middleware
const logger = require('./middleware/logger')
app.use(logger)
const connection = require('./middleware/db_connect');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dashboard
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/app1', (req, res) => {
  res.send('Hello this Apps 1!')
});

app.get('/app2', (req, res) => {
  res.send('Hello this App 2!')
});

app.get('/users', (req, res, next) => {
  const sql = "SELECT * FROM tb_data ORDER BY id desc"
  connection.query(sql, (error, fields) => {
    if (error) {
      console.log('error', error)
    } else {
      res.send(fields)
    }
  })
});


app.get('/users/:id', (req, res, next) => {
  const id = req.params.id
  const sql = "SELECT * FROM tb_data where id = " + id + " ORDER BY id desc"
  connection.query(sql, (error, fields) => {
    if (error) {
      console.log('error', error)
    } else {
      res.send(fields)
    }
  })
});

app.post('/users', (req, res) => {
  const { name, email, no_telp } = req.body;
  const findLatestId = "SELECT id FROM tb_data ORDER BY id DESC LIMIT 1";
  connection.query(findLatestId, (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }

    const latestId = results.length > 0 ? parseInt(results[0].id) : 0;
    const newId = latestId + 1;

    const insertQuery = "INSERT INTO tb_data (id, name, email, no_telp) VALUES (?, ?, ?, ?)";
    const values = [newId, name, email, no_telp];

    connection.query(insertQuery, values, (error, results) => {
      if (error) {
        console.error('Insert error:', error);
        return res.status(500).send(error);
      }

      res.send({ message: "User created successfully", data: { id: newId, name, email, no_telp } });
    });
  });
});


app.listen(process.env.APP_PORT, () => {
  console.log(`Example app listening on port  ${process.env.APP_PORT}`)
})

module.exports = app