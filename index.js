require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./db/config');

const app = express();

app.use(cors());

app.use(express.json());

dbConnection();

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));


app.listen(process.env.PORT, () => {
    console.log(`Server corriendo en el ${process.env.PORT}`);
})