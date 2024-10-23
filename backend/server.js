const express = require('express');
const mysql = require('mysql');
const cors = require('cors');



const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    return res.json("From Backend Side");
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'register'
});

const generateRandomID = () => {
    return Math.floor(10000 + Math.random() * 90000); 
};

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

app.post('/register', (req, res) => {
    const { email, username, password } = req.body;
    const id = generateRandomID(); 

    
    const query = "INSERT INTO users (ID, email, username, password) VALUES (?, ?, ?, ?)";
    db.query(query, [id, email, username, password], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send({ message: "Error inserting data." });
        }
        res.status(201).send({ message: "User registered successfully", userId: id });
    });
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(query, [username, password], (err, result) => {
        if (err) {
            console.error('Error querying data:', err);
            return res.status(500).send({ message: "Error querying data." });
        }
        
        if (result.length > 0) {
            res.send(result);
        } else {
            res.send({ message: "Wrong username or password" });
        }
    });
});

app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});
