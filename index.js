const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();

const port = process.env.PORT

// Middleware 
app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
    res.send("Hello")
})

app.listen(port, () => {
    console.log(`Server is Running on port : ${port}`);
})