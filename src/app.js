const express = require('express');
const { config } = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

config();

const bookRoutes = require('./routes/book.routes');

//usamos expres para los midlewares
const app = express();
app.use(bodyParser.json()); //parseador de bodys

//conectaremos la base de datos
mongoose.connect(process.env.MONGO_URL, {
    dbName: process.env.MONGO_DB_NAME,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS
});

const db = mongoose.connection;

app.use('/books', bookRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})