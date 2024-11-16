import React, {useState, useEffect} from 'react'
import './managerportal.css'
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import HttpsIcon from '@mui/icons-material/Https';
import axios from 'axios';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useNavigate } from 'react-router-dom';


function Managerportal(){

    const[username, setUsername] = React.useState('');
    const[password, setPassword] = React.useState('');
    const[signStatus, setSignStatus] = React.useState('');
    const [managerId, setManagerId] = React.useState(null);

    const classification = 1;
    const navigate = useNavigate();

    const handleSubmit = (e) =>{
        e.preventDefault();
    };

    const login = (e) =>{
        e.preventDefault();
        axios.post("http://localhost:8081/login",{
            classification: classification,
            username: username, 
            password: password,
        }).then((response) => {
            if(response.data.message == "Success"){
                setSignStatus(response.data.message);
                setManagerId(response.data.userId); 
                sessionStorage.setItem("managerId", response.data.userId); 
                navigate("/managerportal/managerdashboard");
            }
            else{
                setSignStatus("No record");
            }
        })
    }


    useEffect(() => {
        axios.get("http://localhost:8081/login").then((response) => {
            if(response.data.loggedIn==true){
            console.log(response.data.user[0].username);
            setManagerId(response.data.user[0].ID);
            }
        });
    }, []);

    return(
        <div className="container">
            <div className="header">
            <div className="text">Manager Sign-in Portal</div>
            <div className="underline"></div>
            </div>
            <div className="inputs">
            
           
            <div className="input">
                <PersonIcon></PersonIcon>
                <input type="text" placeholder='Username'  onSubmit={(e) => handleSubmit(e)} onChange={(e) => setUsername(e.target.value)}/>
            </div>

            <div className="input">
                <HttpsIcon></HttpsIcon>
                <input type="password" placeholder='Password'  onSubmit={(e) => handleSubmit(e)} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            </div>
            <div className="submit-container">
            <div className="toLogin" onClick={(e) => login(e)}>Login</div>
            <div className="toRegister" onClick={() => navigate("/")}>Signup</div>
            <div className="toStudent" onClick={() => navigate("/studentportal")}>Student</div>
            </div>
        </div>
    )
}


export default Managerportal
