import React, { useState } from 'react';

const Dashboard = () => {
    const[activeTab, setActiveTab] = useState("Saved Properties");

    const Sidebar = () => {
        switch(activeTab) {
            case "Marketplace":
                return <p>Marketplace</p>
            case "Saved Properties":
                return <p>Saved Properties</p>
            case "Tasks":
                return <p>Tasks</p>
        }
    };

    return (
        <div className="dashboard">
            <div className="sidebar">
            <button onClick={() => setActiveTab("Marketplace") }>Marketplace</button>
            <button onClick={() => setActiveTab("Saved Properties") }>Saved Properties</button>
            <button onClick={() => setActiveTab("Tasks") }>Tasks</button>
            </div>
            <div className='dynamicContent'>
                <h1>{activeTab}</h1>
                {Sidebar()}
            </div>
        </div>

    );
};
export default Dashboard;