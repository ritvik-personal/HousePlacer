import React, { useState } from 'react';
import './studentdashboard.css';
import { useNavigate } from 'react-router-dom';
import PropertyForm from './createproperty';

const ManagerDashboard = () => {
    const[activeTab, setActiveTab] = useState("Saved Properties");
    const navigate = useNavigate();

    const logout = () => {
        navigate("/")
    }
    const Sidebar = () => {
        switch(activeTab) {
            case "Marketplace":
                return 
            case "My Properties":
                return 
            case "Tasks":
                return <PropertyForm/>
        }
    };

    return (
        <div className="dashboard">
            <div className="sidebar">
            <button onClick={() => setActiveTab("Marketplace") }>Marketplace</button>
            <button onClick={() => setActiveTab("Saved Properties") }>My Properties</button>
            <button onClick={() => setActiveTab("Tasks") }>Tasks</button>
            <button on onClick={logout}>Logout</button>
            </div>
            <div className='dynamicContent'>
                {Sidebar()}
            </div>
        </div>

    );
};
export default ManagerDashboard;