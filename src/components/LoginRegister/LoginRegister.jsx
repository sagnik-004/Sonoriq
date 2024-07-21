import React, { useState, useEffect } from 'react';
import './LoginRegister.css';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail, db, doc, setDoc, getDoc, query, where, collection, getDocs } from "../../components/LoginRegister/firebase";
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../components/LoginRegister/userStore';
import upload from "../../components/LoginRegister/upload";
import { FaUser, FaLock, FaGoogle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoMdPhotos } from "react-icons/io";

const LoginRegister = () => {
    const navigate = useNavigate();
    const setUser = useUserStore(state => state.setUser);

    const [action, setAction] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [userid, setUserid] = useState('');
    const [bio, setBio] = useState('');
    const [genres, setGenres] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const savedEmail = localStorage.getItem('email');
        const savedPassword = localStorage.getItem('password');
        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    const registerLink = () => setAction('register');

    const loginLink = () => setAction('login');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);

            const userDoc = {
                username,
                email,
                id: res.user.uid,
            };
            await setDoc(doc(db, "users", res.user.uid), userDoc);

            setUser(userDoc);
            setAction('user-id-avatar');
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
            setUser(userDoc.data());

            if (rememberMe) {
                localStorage.setItem('email', email);
                localStorage.setItem('password', password);
            } else {
                localStorage.removeItem('email');
                localStorage.removeItem('password');
            }

            navigate('/chat');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists()) {
                const newUserDoc = {
                    username: user.displayName,
                    email: user.email,
                    userid: user.uid,
                    id: user.uid,
                    bio: '',
                    genres: [],
                    blocked: [],
                    imageUrl: user.photoURL
                };
                await setDoc(doc(db, "users", user.uid), newUserDoc);
                setUser(newUserDoc);
                setAction('user-id-avatar'); // Redirect to User ID and Avatar page for first-time Google sign-in
            } else {
                setUser(userDoc.data());
                navigate('/chat'); // Redirect to chat page if user already exists
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            alert("Please enter your email address.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            alert("Password reset email sent!");
        } catch (error) {
            alert(error.message);
        }
    };

    const handleUserIdAvatarSubmit = async (e) => {
        e.preventDefault();
        try {
            const q = query(collection(db, "users"), where("userid", "==", userid));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                alert("User ID already exists!");
                return;
            }

            let imageUrl = '';
            if (image) {
                imageUrl = await upload(image, `avatars/${userid}`);
            }

            const userDocRef = doc(db, "users", auth.currentUser.uid);
            await setDoc(userDocRef, { userid, imageUrl }, { merge: true });

            const updatedUserDoc = await getDoc(userDocRef);
            setUser(updatedUserDoc.data());
            setAction('bio-genres');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleBioGenresSubmit = async (e) => {
        e.preventDefault();
        try {
            const userDocRef = doc(db, "users", auth.currentUser.uid);
            await setDoc(userDocRef, { bio, genres: genres.split(',').map(genre => genre.trim()) }, { merge: true });

            const updatedUserDoc = await getDoc(userDocRef);
            setUser(updatedUserDoc.data());
            navigate('/chat');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="login-register-page">
            <div className={`wrapper ${action}`}>
                {action === 'login' && (
                    <div className="form-box login">
                        <form onSubmit={handleLogin}>
                            <h1>Login</h1>
                            <div className="input-box">
                                <input type="text" placeholder='Email or User ID' value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <FaUser className='icon'/>
                            </div>
                            <div className="input-box">
                                <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <FaLock className='icon'/>
                            </div>
                            <div className="remember-forgot">
                                <label>
                                    <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                                    &nbsp;Remember me
                                </label>
                                <a href='#' onClick={handleForgotPassword}>Forgot Password?</a>
                            </div>
                            <button type="submit" className='login-btn'>Login</button>
                            <button type="button" className="google-sign-in" onClick={handleGoogleSignIn}>
                                Sign in with Google &nbsp;<FaGoogle />
                            </button>
                            <div className="register-link">
                                <p>Don't have an account? 
                                    <a href='#' onClick={registerLink}> Register</a>
                                </p>
                            </div>
                        </form>
                    </div>
                )}

                {action === 'register' && (
                    <div className="form-box register">
                        <form onSubmit={handleRegister}>
                            <h1>Register</h1>
                            <div className="input-box">
                                <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} required />
                                <FaUser className='icon'/>
                            </div>
                            <div className="input-box">
                                <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <MdEmail className='icon'/>
                            </div>
                            <div className="input-box">
                                <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <FaLock className='icon'/>
                            </div>
                            <button type="submit">Register</button>
                            <div className="register-link">
                                <p>Already have an account?
                                    <a href='#' onClick={loginLink}> Login</a>
                                </p>
                            </div>
                        </form>
                    </div>
                )}

                {action === 'user-id-avatar' && (
                    <div className="form-box user-id-avatar">
                        <form onSubmit={handleUserIdAvatarSubmit}>
                            <h1>User ID and Avatar</h1>
                            <div className="input-box">
                                <input type="text" placeholder='User ID' value={userid} onChange={(e) => setUserid(e.target.value)} required />
                                <FaUser className='icon'/>
                            </div>
                            <div className="input-box">
                                <input type="file" id="file-input" onChange={(e) => {
                                    setImage(e.target.files[0]);
                                    setImageUrl(URL.createObjectURL(e.target.files[0]));
                                }} style={{ display: 'none' }} />
                                {image && (
                                    <div className="avatar-preview">
                                        <img src={imageUrl} alt="Avatar Preview" />
                                    </div>
                                )}
                                <label htmlFor="file-input" className="custom-file-label">
                                    Choose your Avatar &nbsp;<IoMdPhotos />
                                </label>
                                
                            </div>
                            <button type="submit">Next</button>
                        </form>
                    </div>
                )}

                {action === 'bio-genres' && (
                    <div className="form-box bio-genres">
                        <form onSubmit={handleBioGenresSubmit}>
                            <h1>Let us know</h1>
                            <div className="input-box">
                                <input type="text" placeholder='Something about you' value={bio} onChange={(e) => setBio(e.target.value)} required></input>
                            </div>
                            <div className="input-box">
                                <input type="text" placeholder='Favourite Genres (comma-separated)' value={genres} onChange={(e) => setGenres(e.target.value)} required />
                            </div>
                            <button type="submit">Complete Registration</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginRegister;
