import React, {useState} from 'react'
import './signup.css'
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


const Signup = () => {


    const[email, setEmail] = React.useState('');
    const[username, setUsername] = React.useState('');
    const[password, setPassword] = React.useState('');
    const[registerStatus, setRegisterStatus] = React.useState('');

    const handleSubmit = (e) =>{
        e.preventDefault();
    };

    const register = (e) =>{
        e.preventDefault();
        axios.post("http://localhost:8081/register",{
            email: email,
            username: username, 
            password: password,
        }).then((response) => {
            if(response.data.message){
                setRegisterStatus(response.data.message);
            }
            else{
                setRegisterStatus("Account created successfully");
            }
        })
    }

    return(
        <div className="container">
            <div className="header">
            <div className="text">Sign up</div>
            <div className="underline"></div>
            </div>
            <div className="inputs">
            
            
            <FormLabel id="demo-row-radio-buttons-group-label" className="radio-label"> I am signing up as a:</FormLabel>
            <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group"className="radio-group">
                <FormControlLabel value="Student" control={<Radio />} label="Student" />
                <FormControlLabel value="Manager" control={<Radio />} label="Manager" />
            </RadioGroup>
           

            <div className="input">
                <EmailIcon></EmailIcon>
                <input type="email" placeholder='Email'  onSubmit={(e) => handleSubmit(e)} onChange={(e) => setEmail(e.target.value)}/>
            </div>
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
            <div className="submit" onClick={(e) => register(e)}>Create Account</div>
            <div className="existingStudent">I am a student</div>
            <div className='existingManager'>I am a manager</div>
            </div>
        </div>
    )
}
export default Signup;