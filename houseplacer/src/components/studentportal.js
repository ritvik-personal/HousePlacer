import React, {useState} from 'react'
import './studentportal.css'
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



function Studentportal(){

    const[username, setUsername] = React.useState('');
    const[password, setPassword] = React.useState('');
    const[signStatus, setSignStatus] = React.useState('');

    const navigate = useNavigate();
    const classification = 0;

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
                navigate("/studentportal/studentdashboard");
            }
            else{
                setSignStatus("Signed in successfully");
            }
        })
    }
    return(
        <div className="container">
            <div className="header">
            <div className="text">Student Sign-in Portal</div>
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
            <div className="toManager" onClick={() => navigate("/managerportal")}>Manager</div>
            </div>
        </div>
    )
}


export default Studentportal
