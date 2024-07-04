import React, { useState } from 'react';
import './LoginRegister.css';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db } from "../../lib/firebase";
import { doc, setDoc, getDoc, query, where, collection, getDocs } from "firebase/firestore";
import { useUserStore } from '../../lib/userStore'; // Import the user store
import upload from "../../lib/upload"; // Import the upload function

const LoginRegister = () => {
    const [action, setAction] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [userid, setUserid] = useState('');
    const [bio, setBio] = useState('');
    const [genres, setGenres] = useState('');
    const [image, setImage] = useState(null);

    const setUser = useUserStore(state => state.setUser); // Get the setUser method from the store

    const registerLink = () => {
        setAction('active');
    };

    const loginLink = () => {
        setAction('');
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Check if the userid already exists
            const q = query(collection(db, "users"), where("userid", "==", userid));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                alert("User ID already exists!");
                return;
            }

            const res = await createUserWithEmailAndPassword(auth, email, password);

            let imageUrl = '';
            if (image) {
                imageUrl = await upload(image);
            }

            const userDoc = {
                username,
                email,
                userid,
                id: res.user.uid,
                bio,
                genres: genres.split(',').map(genre => genre.trim()),
                blocked: [],
                imageUrl
            };
            await setDoc(doc(db, "users", res.user.uid), userDoc);
            await setDoc(doc(db, "userchats", res.user.uid), { chats: [] });

            setUser(userDoc); // Set the current user in the store
            alert('Registration successful!');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            let userCredential;
            if (email.includes("@")) {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            } else {
                const q = query(collection(db, "users"), where("userid", "==", email));
                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    alert("User ID does not exist!");
                    return;
                }
                const userDoc = querySnapshot.docs[0];
                const userEmail = userDoc.data().email;
                userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
            }
            const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
            setUser(userDoc.data()); // Set the current user in the store
            alert('Login successful!');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className={`wrapper ${action}`}>
            <div className="form-box login">
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder='Email or User ID' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <span className='icon'>U</span>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <span className='icon'>L</span>
                    </div>
                    <div className="remember-forgot">
                        <label><input type="checkbox" />Remember me</label>
                        <a href="#">Forgot Password?</a>
                    </div>
                    <button type="submit">Login</button>
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
                        <span className='icon'>U</span>
                    </div>
                    <div className="input-box">
                        <input type="text" placeholder='User ID' value={userid} onChange={(e) => setUserid(e.target.value)} required />
                        <span className='icon'>I</span>
                    </div>
                    <div className="input-box">
                        <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <span className='icon'>E</span>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <span className='icon'>L</span>
                    </div>
                    <div className="input-box">
                        <input type="text" placeholder='Bio (max 30 chars)' value={bio} onChange={(e) => setBio(e.target.value)} maxLength="30" required />
                        <span className='icon'>B</span>
                    </div>
                    <div className="input-box">
                        <input type="text" placeholder='Genres (comma separated, max 3)' value={genres} onChange={(e) => setGenres(e.target.value)} required />
                        <span className='icon'>G</span>
                    </div>
                    <div className="input-box">
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                        <span className='icon'>P</span>
                    </div>
                    <div className="remember-forgot">
                        <label><input type="checkbox" />I agree to the Terms & Conditions</label>
                    </div>
                    <button type="submit">Register</button>
                    <div className="register-link">
                        <p>Already have an account?
                            <a href="#" onClick={loginLink}> Login</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginRegister;
