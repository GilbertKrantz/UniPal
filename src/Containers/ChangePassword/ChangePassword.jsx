import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './ChangePassword.css'

// Firebase SDK
import { auth, db } from "../../Firebase"
// Firebase Firestore SwDK
import { doc, getDoc } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";

const ChangePassword = () => {
    const [userProfile, setUserProfile] = useState('');
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const navigateTo = useNavigate();

    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            const userDoc = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userDoc);
            if (docSnap.exists()) {
                setUserProfile(docSnap.data());
            } else {
                console.log('No User!!!!');
            }
        });
    }
    
    useEffect(() => {
        fetchUserData();
        if (userProfile) {
            setEmail(userProfile['email']);
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();

        sendPasswordResetEmail(auth, email)
        .then(() => {
            alert('Email atur ulang kata sandi telah dikirim');
            navigateTo('/signin');
        })
        .catch((error) => {
            setError("Gagal mengirim email atur ulang sandi");
        });
    }

    return (
        <div className="ChangePassword">
            <div className="signin__header">
                <h1 className="signin__header-title logo">UniPal</h1>
                <p className="signin__header-subtitle">Your Campus Assistant</p>
            </div>
            <div className="ChangePassword__form-container">
                <div className="ChangePassword__form-header">
                    Lupa / Ganti Kata Sandi
                </div>
                <form className="ChangePassword__form" onSubmit={handleSubmit}>
                    <div className="ChangePassword__input-container">
                        <label htmlFor="email" className="ChangePassword__input-label">Alamat Email</label>
                        <input
                            type="email"
                            id="email"
                            className="ChangePassword__input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="ChangePassword__submit-button">Ganti kata sandi</button>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;