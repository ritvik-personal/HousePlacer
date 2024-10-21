import React from 'react'
import './Signup.css'
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import HttpsIcon from '@mui/icons-material/Https';


const Signup = () => {

    //const[action, setAction] = React.useState("Create Account");

    return(
        <div className="container">
            <div className="header">
            <div className="text">Sign up</div>
            <div className="underline"></div>
            </div>
            <div className="inputs">
            <div className="input">
                <EmailIcon></EmailIcon>
                <input type="email" placeholder='email'/>
            </div>
            <div className="input">
                <PersonIcon></PersonIcon>
                <input type="text" placeholder='username'/>
            </div>
            <div className="input">
                <HttpsIcon></HttpsIcon>
                <input type="password" placeholder='password'/>
            </div>
            </div>
            <div className="submit-container">
                <div className="submit">Create Account</div>
                <div className="existingStudent">I am a student</div>
                <div className='existingManager'>I am a manager</div>
            </div>
        </div>
    )
}
export default Signup;