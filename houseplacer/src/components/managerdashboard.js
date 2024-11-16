import React, { useState } from 'react';
import './studentdashboard.css';
import { useNavigate } from 'react-router-dom';
import PropertyForm from './createproperty';
import PropertiesList from './propertieslist';

const ManagerDashboard = () => {
    const[activeTab, setActiveTab] = useState("Saved Properties");
    const navigate = useNavigate();
    const managerId = sessionStorage.getItem('managerId');

    const logout = () => {
        navigate("/")
    }
    const Sidebar = () => {
        switch(activeTab) {
            case "Marketplace":
                return 
            case "Saved Properties":
                console.log("Sure");
                return <PropertiesList managerId={managerId}/>;
            case "Tasks":
                console.log("Excellent");
                return <PropertyForm/>;
            default:
                return null;
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