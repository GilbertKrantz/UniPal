import React, { useEffect, useState } from "react";
import './Register.css';
import PasswordChecklist from "react-password-checklist";
import { useNavigate } from "react-router-dom";
import useSignIn from "react-auth-kit/hooks/useSignIn";

// Firebase SDK
import { auth, db } from "../../Firebase"
// Firebase Auth SDK
import { createUserWithEmailAndPassword } from "firebase/auth";

// Firebase Database SDK
import { setDoc, doc } from "firebase/firestore";

const validateName = (name) => {
    // if name is empty, have a number, and have a special character, return false
    if (name === "") {
        return "No Name";
    } else if (name.match(/\d+/g) || name.match(/[^a-zA-Z0-9]/g)) {
        return "Invalid Name";
    }
    return true;
}

const Register = () => {

    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isValidPassword, setIsValidPassword] = useState(false);
    const [error, setError] = useState('');
    const navigateTo = useNavigate();
    const signIn = useSignIn();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log(user);
                    signIn({
                        auth: {
                            token: user.accessToken,
                            type: 'Bearer',
                        }
                    });
                })
                .catch((error) => {
                    setError(error.message);
                });
                
                if (auth.currentUser) {
                    const userDoc = doc(db, 'users', auth.currentUser.uid);
                    await setDoc(userDoc, {
                        username: name,
                        gender: gender,
                        email: auth.currentUser.email,
                        profilePicture: "default"
                    });
                    navigateTo('/chat');
                }
        } catch (error) {
            setError(error.message);
        }
        
    }

    return (
        <div className="register">
            <div></div>
            <div className="signin__header">
                <h1 className="signin__header-title logo">UniPal</h1>
                <p className="signin__header-subtitle">Your Campus Assistant</p>
            </div>
            <div className="register__form-container">
                {error && <p className="register__error">{error}</p>}
                <form onSubmit={handleRegister} className="register__form">
                    <div className="register__input-container">
                        <label htmlFor="name" className="register__input-label">Nama</label>
                        <input
                            autoComplete="off"
                            type="text"
                            id="name"
                            className="register__input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        {/* Error if name isn't valid */}
                       {validateName(name) !== true && <p className="register__error">{validateName(name)}</p>}

                    </div>
                    <div className="register__input-container">
                        <label htmlFor="gender" className="register__input-label">Gender</label>
                        <div className="register__input-gender-container">
                            <div className="register__gender-choice">
                                <input type="radio" id="male" name="gender" className="register__input-gender" value="Male" onChange={(e) => setGender(e.target.value)}  />
                                <label htmlFor="male" className="register__gender-label">Pria</label>
                            </div>
                            <div className="register__gender-choice">
                                <input type="radio" id="female" name="gender" className="register__input-gender" value="Female" onChange={(e) => setGender(e.target.value)} />
                                <label htmlFor="female" className="register__gender-label">Wanita</label>
                            </div>
                            <div className="register__gender-choice">
                                <input type="radio" id="others" name="gender" className="register__input-gender" value="Others" onChange={(e) => setGender(e.target.value)} />
                                <label htmlFor="others" className="register__gender-label">Lainnya</label>
                            </div>
                        </div>
                    </div>
                    <div className="register__input-container">
                        <label htmlFor="email" className="register__input-label">Alamat Email</label>
                        <input
                            type="email"
                            id="email"
                            className="register__input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="register__input-container">
                        <label htmlFor="password" className="register__input-label">Kata Sandi</label>
                        <input
                            type="password"
                            id="password"
                            className="register__input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="register__input-container">
                        <label htmlFor="confirmPassword" className="register__input-label">Konfirmasi Kata Sandi</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="register__input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <PasswordChecklist
                        rules={["minLength", "number", "match"]}
                        minLength={8}
                        value={password}
                        valueAgain={confirmPassword}
                        onChange={(isValid) => { setIsValidPassword(isValid) }}
                        messages={{
                            minLength: "Kata sandi lebih panjang dari 8 karakter.",
                            // specialChar: "Kata sandi memiliki karakter khusus.",
                            number: "Kata sandi terdiri dari angka.",
                            // capital: "Kata sandi menggunakan huruf kapital.",
                            match: "Kata sandi cocok.",
                        }}
                        className="register__password-check"
                    />
                    <button type='submit' className="register__submit-button">Daftar</button>
                    {/* <button type='submit' className="register__submit-button" disabled={false}>Daftar</button> */}
                    <p className="signin__register">Sudah memiliki akun? <a href="/signin" className="signin__register-link">Masuk</a></p>
                </form>
                {/* <button className="register__submit-button"><span style={{color:"red"}} onClick={deleteAllData}>DELETE ALL</span></button> */}
            </div>
        </div>
    );
}

export default Register;