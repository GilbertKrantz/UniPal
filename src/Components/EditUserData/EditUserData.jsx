import React, { useEffect, useRef, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './EditUserData.css'

// Firebase SDK
import { auth, db, storage } from "../../Firebase"
// Firebase Firestore SwDK
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EditUserData = ({ onBack }) => {

    const [fileName, setFileName] = useState('Tidak ada file');
    const FILE_MAX_SIZE = 10 * 1024 * 1024; // Maximum file size is 10 MB
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const [userProfile, setUserProfile] = useState('');

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
    })

    const handleFileButtonClick = (e) => {
        e.preventDefault();
        fileInputRef.current.click();
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (!file) {
            setFileName('Tidak ada file');
            return;
        }

        if (file.size > FILE_MAX_SIZE) {
            setError('Gambar tidak boleh melebihi 10 MB');
            return;
        }

        setFileName(file.name);

      };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const username = e.target.username.value;
        const password = e.target.password.value;
        const profilePicture = e.target.profilePicture.files[0];

        if (!validateName(username)) {
            return;
        }

        // Sign user in to check the user's password is correct or not
        signInWithEmailAndPassword(auth, auth.currentUser.email, password)
        .then(() => {
            auth.onAuthStateChanged(async (user) => { //if successful, profile change are permitted
                const storageRef = ref(storage, `profilePictures/${user.uid}`);
                if (profilePicture) {
                    await uploadBytes(storageRef, profilePicture).then((snapshot) => {
                        console.log('Uploaded a blob or file!');
                    });
                }
                const userDoc = doc(db, 'users', user.uid);
                await setDoc(userDoc, {
                    username: username,
                    email: auth.currentUser.email,
                    profilePicture: profilePicture ? await getDownloadURL(storageRef) : 'default'
                });
            });
        })

        .catch(() => {
            setError('Kata sandi tidak sesuai'); //if not successful, setError that user entered wrong password
        })

        document.getElementsByClassName('EditUserData__form')[0].reset();
        setError('');
    }

  return (
    <>
        <div className={"EditUserData__container"}>
            <div className={"EditUserData__back-button"} onClick={onBack}>
                <FaArrowLeft />
            </div>
            <div className={"EditUserData__container--inner"}>
                <div className={"EditUserData__container--inner--header"}>
                    <h1>Sunting Profil</h1>
                </div>
                <div className={"EditUserData__container--inner--content"}>
                    {error && <div className={"EditUserData__error-message"}>{error}</div>}
                    <form className={"EditUserData__form"} onSubmit={handleSubmit}>
                        <div className={"EditUserData__input"}>
                            <label htmlFor="username" className={"EditUserData__input-label"}>Nama:</label>
                            <input type="text" id="username" name="username" placeholder="Nama" autoComplete='off' defaultValue={userProfile['username']}/>
                        </div>
                        <div className={"EditUserData__input"}>
                            <label htmlFor="profilePicture" className={"EditUserData__input-label"}>Foto Profil:</label>
                            <div className={"EditUserData__input-file-container"}>
                                <button className={"EditUserData__input-file-button"} onClick={handleFileButtonClick}>Pilih file</button>
                                <label htmlFor="profilePicture" className={"EditUserData__input-file"}>{fileName}</label>
                                <input type="file" id="profilePicture" name="profilePicture" ref={fileInputRef} onChange={handleFileChange}/>
                            </div>
                        </div>
                        <div className={"EditUserData__input"}>
                            <label htmlFor="password" className={"EditUserData__input-label"}>Kata Sandi:</label>
                            <div className='Showable-Password'>
                                <input type={passwordType} id="password" name="password" placeholder="Kata Sandi" className='Password-Spacer'/>
                                <span className="Show-Password" onClick={handleShowPassword}><FontAwesomeIcon icon={passwordIcon}/></span>
                            </div>
                        </div>
                        <button type="submit" className={"EditUserData__submit-button"}>Simpan Perubahan</button>
                        <Link to={'/change-password'} className='EditUserData__change-password'>Ganti kata sandi</Link>
                    </form>
                </div>
            </div>
        </div>
    </>
  )
}

export default EditUserData;