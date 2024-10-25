import React, { useState } from 'react';
import './studentdashboard.css';

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
                return 
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
                <h1>{activeTab}</h1>
                {Sidebar()}
            </div>
        </div>

    );
};
export default ManagerDashboard;