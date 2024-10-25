const express = require('express');
const mysql = require('mysql');
const cors = require('cors');


const bcrypt = require('bcrypt');

async function hashPassword(password) {
    const saltRounds = 12; 
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

async function checkPassword(password, hash){
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
}


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

app.post('/register', async (req, res) => {
    const { classification, email, username, password } = req.body;
    const id = generateRandomID(); 
    const hashedPassword = await hashPassword(password);

    let query;
    if(classification == 'Student'){
        query = "INSERT INTO Students (ID, email, username, password) VALUES (?, ?, ?, ?)";
    }
    else{
        query = "INSERT INTO Managers (ID, email, username, password) VALUES (?, ?, ?, ?)"; 
    }
    db.query(query, [id, email, username, hashedPassword], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send({ message: "Error inserting data." });
        }
        res.status(201).send({ message: "User registered successfully", userId: id });
    });
});

app.post('/login', async (req, res) => {
    const classification = req.body.classification;
    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = await hashPassword(password);

    if(checkPassword(password, hashedPassword)){
        let query;
    if(classification == 0){
        query = "SELECT * FROM Students WHERE username = ?"; 
    }
    else{
        query = "SELECT * FROM Managers WHERE username = ?"; 
    }
    
    db.query(query, [username], (err, result) => {
        if (err) {
            console.error('Error querying data:', err);
            return res.status(500).send({ message: "Error querying data." });
        }
        
        if (result.length > 0) {
            res.send({message: "Success"});
        } 
        else {
            res.send({ message: "Wrong username or password" });
        }
    });
    }
    else{
        res.send({message: "Wrong password"});
    }
    
});

app.post('/getUserID', (req, res) =>{
    const {username, password, classification} = req.body;

    let query;
    if(classification == 0){
        query = "SELECT ID FROM Students WHERE username = ? AND password = ?"; 
    }
    else{
        query = "SELECT ID FROM Managers WHERE username = ? AND password = ?"; 
    }

    db.query(query, [username, password], (err, result) =>{
        if(err){
            return res.status(500).send({ message: "Error retrieving data." });
        }
        else{
            if (result.length > 0) {
                res.status(200).send({ message: "User found", userId: result[0].ID });
            } 
            else {
                res.status(404).send({ message: "User not found" });
            }
        }
    })
})


app.post('/newproperty', (req, res) => {

    const {property_name, no_bedrooms, address, no_bathrooms, sq_footage, dist_campus, parking, property_description, rent, website} = req.body;
    const id = generateRandomID(); 

    query = "INSERT INTO Property (ID, 	Property_Name, No_Bedrooms, Address, No_Bathrooms, Sq_Footage, Dist_Campus, Parking, Property_Description, Rent, Website) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"; 

    db.query(query, [id, property_name, no_bedrooms, address, no_bathrooms, sq_footage, dist_campus, parking, property_description, rent, website], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send({ message: "Error inserting data." });
        }
        res.status(201).send({ message: "Property added successfully", userId: id });
    });

})

app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});
