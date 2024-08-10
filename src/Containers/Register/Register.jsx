import React, { useEffect, useState } from "react";
import './Register.css';
import PasswordChecklist from "react-password-checklist";
import { useNavigate } from "react-router-dom";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

// Firebase SDK
import { auth, db, storage } from "../../Firebase"
// Firebase Auth SDK
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

// Firebase Database SDK
import { setDoc, doc } from "firebase/firestore";

// Firebase Storage SDK
import { ref, uploadBytes } from "firebase/storage";

const validateName = (name) => {
    // if name is empty, have a number, length of name is longer than 20 or have a special character apart from space, return false
    if (name === "") {
        return "Tidak ada nama";
    } else if (name.match(/\d+/g) || name.match(/[^a-zA-Z0-9 ]/g)) {
        return "Nama tidak valid";
    } else if (name.length > 20) {
        return "Nama tidak boleh lebih dari 20 karakter"
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

    const toggleCheck = (value) => {
        if (gender === value) {
            setGender(null);
        } else {
            setGender(value);
        }
    }

    // Show password function
    const [passwordType, setPasswordType] = useState('password');
    const [passwordIcon, setPasswordIcon] = useState(faEyeSlash);

    const handleShowPassword = () => {
        if (passwordType === 'password') {
            setPasswordIcon(faEye);
            setPasswordType('text');
        } else {
            setPasswordIcon(faEyeSlash);
            setPasswordType('password');
        }
    }

    // Show confirm password function
    const [confirmPasswordType, setConfirmPasswordType] = useState('password');
    const [confirmPasswordIcon, setConfirmPasswordIcon] = useState(faEyeSlash);

    const handleShowConfirmPassword = () => {
        if (confirmPasswordType === 'password') {
            setConfirmPasswordIcon(faEye);
            setConfirmPasswordType('text');
        } else {
            setConfirmPasswordIcon(faEyeSlash);
            setConfirmPasswordType('password');
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validateName(name) || password === '' || password.match(/\d+/g) || password.localeCompare(confirmPassword) || !isValidPassword) {
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password)
                .then( async (userCredential) => {
                    const user = userCredential.user;
                    await sendEmailVerification(user)
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

                    const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
                    await uploadBytes(storageRef, new Blob()).then((snapshot) => {
                        console.log('Uploaded a blob or file!');
                    });
                    // Check if email is verified
                    if (auth.currentUser.emailVerified) {
                        signIn(
                            {
                                auth: {
                                    token: auth.currentUser.accessToken,
                                    type: 'Bearer',
                                }
                            }
                        );
                    } else {
                        // Sign out user if email is not verified
                        auth.signOut();
                        setError("Email belum diverifikasi. Silahkan cek email Anda.");
                    }

                    navigateTo('/signin');
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
                                <input type="radio" id="male" name="gender" className="register__input-gender" value="Male" checked={gender === 'Male'} onClick={(e) => toggleCheck(e.target.value)} onChange={(e) => setGender(e.target.value)}  />
                                <label htmlFor="male" className="register__gender-label">Pria</label>
                            </div>
                            <div className="register__gender-choice">
                                <input type="radio" id="female" name="gender" className="register__input-gender" value="Female" checked={gender === 'Female'} onClick={(e) => toggleCheck(e.target.value)} onChange={(e) => setGender(e.target.value)} />
                                <label htmlFor="female" className="register__gender-label">Wanita</label>
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
                        <div className="Showable-Password">
                            <input
                                type={passwordType}
                                id="password"
                                className="register__input Password-Spacer"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span className="Show-Password" onClick={handleShowPassword}><FontAwesomeIcon icon={passwordIcon}/></span>
                        </div>
                    </div>
                    <div className="register__input-container">
                        <label htmlFor="confirmPassword" className="register__input-label">Konfirmasi Kata Sandi</label>
                        <div className="Showable-Password">
                            <input
                                type={confirmPasswordType}
                                id="confirmPassword"
                                className="register__input Password-Spacer"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <span className="Show-Password" onClick={handleShowConfirmPassword}><FontAwesomeIcon icon={confirmPasswordIcon}/></span>
                        </div>
                    </div>
                    <PasswordChecklist
                        rules={["minLength", "number", "match"]}
                        minLength={8}
                        value={password}
                        valueAgain={confirmPassword}
                        onChange={(isValid) => { setIsValidPassword(isValid) }}
                        messages={{
                            minLength: "Kata sandi minimal 8 karakter.",
                            // specialChar: "Kata sandi memiliki karakter khusus.",
                            number: "Kata sandi mengandung angka.",
                            // capital: "Kata sandi menggunakan huruf kapital.",
                            match: "Konfirmasi kata sandi cocok.",
                        }}
                        className="register__password-check"
                    />
                    <button type='submit' className="register__submit-button">Daftar</button>
                    {/* <button type='submit' className="register__submit-button" disabled={false}>Daftar</button> */}
                    <p className="register__signin">Sudah memiliki akun? <Link to={'/signin'} className="register__signin-link">Masuk</Link></p>
                </form>
                {/* <button className="register__submit-button"><span style={{color:"red"}} onClick={deleteAllData}>DELETE ALL</span></button> */}
            </div>
        </div>
    );
}

export default Register;