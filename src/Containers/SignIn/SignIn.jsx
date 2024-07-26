import React, { useState } from 'react';
import './SignIn.css';

import useSignIn from 'react-auth-kit/hooks/useSignIn';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';

const SignIn = () => {
    const signIn = useSignIn();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignIn = async (e) => {
        e.preventDefault();
        // Send a POST request to the server
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password }),
        });

        if (!response.ok) {
            const data = await response.json();
            setError(data.message);
            return;
        } else {
            const data = await response.json();
            const token = data.token;
            signIn({
                auth: {
                    token: token,
                    type: 'Bearer',
                }
            }
            )
            window.location.href = '/chat';
        }
    };

    return (
        <div className="signin">
            <div className="signin__header">
                <h1 className="signin__header-title logo">UniPal</h1>
                <p className="signin__header-subtitle">Your Campus Assistant</p>
            </div>
            <div className="signin__form-container">
                <form onSubmit={handleSignIn} className="signin__form">
                    <div className="signin__input-container">
                        <label htmlFor="email" className="signin__input-label">Alamat Email</label>
                        <input
                            type="email"
                            id="email"
                            className="signin__input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="signin__input-container">
                        <label htmlFor="password" className="signin__input-label">Kata Sandi</label>
                        <input
                            type="password"
                            id="password"
                            className="signin__input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="signin__error">{error}</p>}
                    <button type="submit" className="signin__submit-button">Lanjut</button>
                </form>
                <p className="signin__register">Tidak memiliki akun? <a href="/register" className="signin__register-link">Daftar</a></p>
            </div>
        </div>
    );
};

export default SignIn;
