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
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { toast, ToastContainer } from 'react-toastify';


const Signup = () => {


    const navigate = useNavigate();

    const[email, setEmail] = React.useState('');
    const[username, setUsername] = React.useState('');
    const[password, setPassword] = React.useState('');
    const[classification, setClassification] = React.useState('Student');
    const[registerStatus, setRegisterStatus] = React.useState('');
    const[errorStatements, setErrorStatements] = React.useState(['', '', '', '']);
    const[emailError, setEmailError] = React.useState(false);
    const[nameError, setNameError] = React.useState(false);
    const[classificationError, setClassificationError] = React.useState(false);
    const[passwordError, setPasswordError] = React.useState(false);

    const handleSubmit = (e) =>{
        e.preventDefault();
    };

    const validate = () => {
        let valid = true;
        const errors = ['', '', '', '']
    
        if(email === '' || !email.includes("@")){
            setEmailError(true);
            errors[0] = 'Email is invalid.';
            valid = false;
        } 
    
        if(username.length < 5){
            setNameError(true);
            errors[1] =  'Username is invalid. Remember your username must be at least 5 characters long.';
            valid = false;
        } 
    
        if(classification === ''){
            setClassificationError(true);
            errors[2] = 'You must identify as either a student or manager.';
            valid = false;
        } 
    
        if(password.length < 8){
            setPasswordError(true);
            errors[3] = 'Password is invalid. Remember, your password must be at least 8 characters long.';
            valid = false;
        } 
        setErrorStatements(errors);
        return valid;
    };
    

    

    const register = (e) =>{
        e.preventDefault();
        if(validate() == false){
            toast.error("Please make sure all fields are completed correctly.",
                {position: "bottom-right", 
                    autoClose: 5000,
                }
            )
        }
        else{
        axios.post("http://localhost:8081/register",{
            classification: classification,
            email: email,
            username: username, 
            password: password,
        }).then((response) => {
            if(response.data.message){
                setRegisterStatus(response.data.message);
                if(classification !== "Student"){
                    navigate("/managerdashboard");
                }
                else{
                    navigate("/studentdashboard");
                }
            }
            else{
                setRegisterStatus("Account created successfully");
            }
        })
    }
    }

    return (
        <div className="container">
          <div className="header">
            <div className="text">Sign up</div>
            <div className="underline"></div>
          </div>
          <div className="inputs">
      
            <FormLabel id="demo-row-radio-buttons-group-label" className="radio-label"> I am signing up as a:</FormLabel>
            <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group" value={classification} className="radio-group" onChange={(e) => setClassification(e.target.value)}>
              <FormControlLabel value="Student" control={<Radio />} label="Student" />
              <FormControlLabel value="Manager" control={<Radio />} label="Manager" />
            </RadioGroup>
      
            <div className={`input ${emailError ? 'error' : ''}`}>
              <EmailIcon />
              <input type="email" placeholder='Email' onSubmit={(e) => handleSubmit(e)} onChange={(e) => setEmail(e.target.value)} />
              {emailError && <span className="error-message">{errorStatements[0]}</span>}
            </div>
      
            <div className={`input ${nameError ? 'error' : ''}`}>
              <PersonIcon />
              <input type="text" placeholder='Username' onSubmit={(e) => handleSubmit(e)} onChange={(e) => setUsername(e.target.value)} />
              {nameError && <span className="error-message">{errorStatements[1]}</span>}
            </div>
      
            <div className={`input ${passwordError ? 'error' : ''}`}>
              <HttpsIcon />
              <input type="password" placeholder='Password' onSubmit={(e) => handleSubmit(e)} onChange={(e) => setPassword(e.target.value)} />
              {passwordError && <span className="error-message">{errorStatements[3]}</span>}
            </div>
      
          </div>
      
          <div className="submit-container">
            <div className="register" onClick={(e) => register(e)}>Create an Account</div>
            <div className="existingStudent" onClick={() => navigate("./studentportal")}>Already a student</div>
            <div className="existingManager" onClick={() => navigate("./managerportal")}>Already a manager</div>
          </div>
        </div>
      );
      
    
}
export default Signup;