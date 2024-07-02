import React, { useState } from 'react';
import './LoginRegister.css';
import { FaUser, FaLock, FaEnvelope, FaGoogle } from "react-icons/fa";
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithGoogle } from '../../firebase';
import Modal from '../Modal';

const LoginRegister = () => { 
    const [action, setAction] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [showModal, setShowModal] = useState(false);

    const registerLink = () => {
        setAction('active');
    };

    const loginLink = () => {
        setAction('');
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert('Registration successful!');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert('Login successful!');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            alert('Google sign-in successful!');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleTermsClick = (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    return (
        <div className={`wrapper ${action}`}>
            <div className="form-box login">
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <FaUser className='icon'/>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <FaLock className='icon'/>
                    </div>
                    <div className="remember-forgot">
                        <label><input type="checkbox" />Remember me</label>
                        <a href="#">Forgot Password?</a>
                    </div>
                    <button type="submit">Login</button>
                    <div className="google-signin" onClick={handleGoogleSignIn}>
                        <FaGoogle className="icon" />
                        <span>Sign in with Google</span>
                    </div>
                    <div className="register-link">
                        <p>Don't have an account? 
                            <a href="#" onClick={registerLink}> Register</a>
                        </p>
                    </div>
                </form>
            </div>

            <div className="form-box register">
                <form onSubmit={handleRegister}>
                    <h1>Registration</h1>
                    <div className="input-box">
                        <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} required />
                        <FaUser className='icon'/>
                    </div>
                    <div className="input-box">
                        <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <FaEnvelope className='icon'/>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <FaLock className='icon'/>
                    </div>
                    <div className="remember-forgot">
                        <label>
                            <input type="checkbox" />
                            I agree to the <a href="#" onClick={handleTermsClick}>Terms & Conditions</a>
                        </label>
                    </div>
                    <button type="submit">Register</button>
                    <div className="register-link">
                        <p>Already have an account?
                            <a href="#" onClick={loginLink}> Login</a>
                        </p>
                    </div>
                </form>
            </div>
            
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <h2>Terms and Conditions</h2>
                <p>
                    Welcome to Sonoriq! These terms and conditions outline the rules and regulations for the use of Sonoriq's services.
                    By accessing this website we assume you accept these terms and conditions. Do not continue to use Sonoriq if you do not agree to all of the terms and conditions stated on this page.
                    ...
                </p>
            </Modal>
        </div>
    );
};

export default LoginRegister;
