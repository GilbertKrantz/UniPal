import React, { useState } from "react";
import './Register.css';

const Register = () => {

    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = (e) => {

        e.preventDefault();

    }

    return (
        <div className="register">
            <div className="signin__header">
                <h1 className="signin__header-title logo">UniPal</h1>
                <p className="signin__header-subtitle">Your Campus Assistant</p>
            </div>
            <div className="register__form-container">
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
                    </div>
                    <div className="register__input-container">
                        <label htmlFor="gender" className="register__input-label">Gender</label>
                        <div className="register__input-gender-container">
                            <div className="register__gender-choice">
                                <input type="radio" id="female" name="gender" className="register__input-gender" value="Female" required />
                                <label htmlFor="female" className="register__gender-label">Female</label>
                            </div>
                            <div className="register__gender-choice">
                                <input type="radio" id="male" name="gender" className="register__input-gender" value="Male" required />
                                <label htmlFor="male" className="register__gender-label">Male</label>
                            </div>
                            <div className="register__gender-choice">
                                <input type="radio" id="others" name="gender" className="register__input-gender" value="Others" required />
                                <label htmlFor="others" className="register__gender-label">Others</label>
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
                    <button type="submit" className="register__submit-button">Daftar</button>
                </form>
            </div>
        </div>
    );
}

export default Register;