import React from 'react'
import './Signup.css'
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import HttpsIcon from '@mui/icons-material/Https';
import Button from '@mui/material/Button';


const Signup = () => {


    const[email, setEmail] = React.useState('');
    const[username, setUsername] = React.useState('');
    const[password, setPassword] = React.useState('');

    const handleSubmit = (e) =>{
        e.preventDefault();
    };

    return(
        <div className="container">
            <div className="header">
            <div className="text">Sign up</div>
            <div className="underline"></div>
            </div>
            <div className="inputs">
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
            <Button color="success" variant="contained" className="submit">Create Account</Button>
            <Button color="primary" variant="contained" className="existingStudent">I am a student</Button>
            <Button color="secondary" variant="contained" className='existingManager'>I am a manager</Button>
            </div>
        </div>
    )
}
export default Signup;