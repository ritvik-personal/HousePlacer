import React, { useState } from 'react';
import './studentdashboard.css';
import { useNavigate } from 'react-router-dom';
import StudentPreferenceForm from './studentpreferences';
import Marketplace from './marketplace';
import SavedProperties from './savedproperties';

const StudentDashboard = () => {
    const[activeTab, setActiveTab] = useState("Saved Properties");
    const navigate = useNavigate();
    const studentId = sessionStorage.getItem('studentId');

    const logout = () => {
        navigate("/")
    }
    
    const Sidebar = () => {
        switch(activeTab) {
            case "Marketplace":
                return <Marketplace></Marketplace> 
            case "Saved Properties":
                return <SavedProperties studentId={studentId}/>
            case "Tasks":
                return <StudentPreferenceForm></StudentPreferenceForm>
        }
    };

    return (
        <div className="dashboard">
            <div className="sidebar">
            <button onClick={() => setActiveTab("Marketplace") }>Marketplace</button>
            <button onClick={() => setActiveTab("Saved Properties") }>Saved Properties</button>
            <button onClick={() => setActiveTab("Tasks") }>Tasks</button>
            <button on onClick={logout}>Logout</button>
            </div>
            <div className='dynamicContent preferenceform'>
                {Sidebar()}
            </div>
        </div>

    );
};
export default StudentDashboard;