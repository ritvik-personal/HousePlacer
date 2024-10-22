const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express()
app.use(cors())
app.use(express.json());

app.get('/', (re, res) =>{
    return res.json("From Backend Side");
})

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"register"
})


app.post('/register', (req, res) =>{
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    
    db.query("INSERT INTO users (email, username, password) VALUES()", [email, username, password],
        (err, result) =>{
            if(result){
                res.send(result);
            }
            else{
                res.send({message: "Enter valid credentials"})
            }
        }
    )
})

app.post('/login', (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;
    
    db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password],
        (err, result) =>{
            if(err){
                req.setEncoding({err: err});
            }
            else{
                if(result.length > 0){
                    res.send(result);
                }
                else{
                    res.send({message: "Wrong username or password"});
                }
            }
        }
    )
})

app.listen(8081, ()=>{
    console.log("listening");
})

