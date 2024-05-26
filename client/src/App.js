import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Account from "./components/account/Account";
import Sidebar from "./components/sidebar/Sidebar";
import SuraqJauap from "./components/suraq-jauap/SuraqJauap";
import MaqalDrop from "./components/maqal-drop/MaqalDrop";
import Sozjumbaq from "./components/sozjumbaq/Sozjumbaq";
import Tanda from "./components/tanda/Tanda";
import Sozdly from "./components/sozdly/Sozdly";
import Home from "./components/home/Home";
import Adamzat from "./components/adamzat/Adamzat";
import SignIn from "./components/authorization/SignIn";
import SignUp from "./components/authorization/SignUp";
import axios from "axios";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState({});

    const handleLogin = (userData) => {
        setIsAuthenticated(true);
        setUserData(userData);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserData({});
    };

    return (
        <Router>
            <div className="App">
                {!isAuthenticated ? (
                    <div className="authorization">
                        <Routes>
                            <Route path="/" element={<SignIn onLogin={handleLogin} />} />
                            <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />
                        </Routes>
                    </div>
                ) : (
                    <>
                        <Sidebar />
                        <div className="content">
                            <Routes>
                                <Route path="/home" element={<Home />} />
                                <Route path="/sozdly" element={<Sozdly />} />
                                <Route path="/tanda" element={<Tanda />} />
                                <Route path="/maqalDrop" element={<MaqalDrop />} />
                                <Route path="/suraqJauap" element={<SuraqJauap />} />
                                <Route path="/sozjumbaq" element={<Sozjumbaq />} />
                                <Route path="/adamzat" element={<Adamzat />} />
                            </Routes>
                            
                            <Account username={userData.username} email={userData.email} onLogout={handleLogout} />
                        </div>
                    </>
                )}
            </div>
        </Router>
    );
}

export default App;
