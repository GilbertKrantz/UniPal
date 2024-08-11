import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SignIn.css";

import useSignIn from "react-auth-kit/hooks/useSignIn";
import { Navigate, useNavigate } from "react-router-dom";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";

// Use Firebase Auth SDK to sign in the user
import { auth } from "../../Firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SignIn = () => {
  const signIn = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigateTo = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (!user.emailVerified) {
          setError("Email belum diverifikasi. Silahkan cek email Anda.");
          // sign out the user
          auth.signOut();
          return;
        } else {
            console.log("User is verified");
            console.log(user)
            signIn({
                auth: {
                token: user.accessToken,
                type: "Bearer",
                },
            });
        }

        navigateTo("/chat");
      })
      .catch((error) => {
        setError("Invalid email or password");
      });
  };

  const [passwordType, setPasswordType] = useState("password");
  const [passwordIcon, setPasswordIcon] = useState(faEyeSlash);

  const handleShowPassword = () => {
    if (passwordType === "password") {
      setPasswordIcon(faEye);
      setPasswordType("text");
    } else {
      setPasswordIcon(faEyeSlash);
      setPasswordType("password");
    }
  };

  return isAuthenticated ? (
    <Navigate to="/chat" />
  ) : (
    <div className="signin">
      <div className="signin__header">
        <h1 className="signin__header-title logo">UniPal</h1>
        <p className="signin__header-subtitle">Your Campus Assistant</p>
      </div>
      <div className="signin__form-container">
        <form onSubmit={handleLogin} className="signin__form">
          <div className="signin__input-container">
            <label htmlFor="email" className="signin__input-label">
              Alamat Email
            </label>
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
            <label htmlFor="password" className="signin__input-label">
              Kata Sandi
            </label>
            <div className="Showable-Password">
              <input
                type={passwordType}
                id="password"
                className="signin__input Password-Spacer"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="Show-Password" onClick={handleShowPassword}>
                <FontAwesomeIcon icon={passwordIcon} />
              </span>
            </div>
          </div>
          {error && <p className="signin__error">{error}</p>}
          <button type="submit" className="signin__submit-button">
            Lanjut
          </button>
        </form>
        <p className="signin__register">
          Tidak memiliki akun?{" "}
          <Link to={"/register"} className="signin__register-link">
            Daftar
          </Link>
        </p>
        <Link to={"/change-password"} className="signin__forget-password">
          Lupa Kata Sandi?
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
