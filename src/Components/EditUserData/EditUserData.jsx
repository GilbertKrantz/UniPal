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
import { sendPasswordResetEmail } from 'firebase/auth';

const EditUserData = ({ onBack }) => {

    const [fileName, setFileName] = useState('Tidak ada file');
    const FILE_MAX_SIZE = 10 * 1024 * 1024; // Maximum file size is 10 MB
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const [userProfile, setUserProfile] = useState('');

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        const profilePicture = e.target.profilePicture.files[0];

        // Sign user in to check the user's password is correct or not
        // signInWithEmailAndPassword(auth, auth.currentUser.email, password)
        // .then(() => {
                // if successful, profile change are permitted
        // })

        // .catch(() => {
                // if not successful, setError that user entered wrong password
        // })
        
        auth.onAuthStateChanged(async (user) => {
            // const user = auth.currentUser;
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
        })

        e.target.username.value = '';
        e.target.password.value = '';
        e.target.profilePicture.files = '';
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
                            <label htmlFor="password" className={"EditUserData__input-label"}>Kata Sandi:</label>
                            <input type="password" id="password" name="password" placeholder="Kata Sandi" />
                        </div>
                        <div className={"EditUserData__input"}>
                            <label htmlFor="profilePicture" className={"EditUserData__input-label"}>Foto Profil:</label>
                            <div className={"EditUserData__input-file-container"}>
                                <button className={"EditUserData__input-file-button"} onClick={handleFileButtonClick}>Pilih file</button>
                                <label htmlFor="profilePicture" className={"EditUserData__input-file"}>{fileName}</label>
                                <input type="file" id="profilePicture" name="profilePicture" ref={fileInputRef} onChange={handleFileChange}/>
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