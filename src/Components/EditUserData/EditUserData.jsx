import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import './EditUserData.css'

// Firebase SDK
import { auth, db, storage } from "../../Firebase"
// Firebase Firestore SwDK
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const EditUserData = ({ onBack }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const profilePicture = e.target.profilePicture.files[0];
        
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
                email: email,
                profilePicture: profilePicture ? await getDownloadURL(storageRef) : 'default'
            });
        })

        e.target.username.value = '';
        e.target.email.value = '';
        e.target.password.value = '';
        e.target.profilePicture.value
    }

  return (
    <>
        <div className={"EditUserData__container"}>
            <div className={"EditUserData__back-button"} onClick={onBack}>
                <FaArrowLeft />
            </div>
            <div className={"EditUserData__container--inner"}>
                <div className={"EditUserData__container--inner--header"}>
                    <h1>Sunting Data User</h1>
                </div>
                <div className={"EditUserData__container--inner--content"}>
                    <form className={"EditUserData__form"}>
                        <div className={"EditUserData__input"}>
                            <label htmlFor="username">Nama:</label>
                            <input type="text" id="username" name="username" placeholder="Username" autoComplete='off'/>
                        </div>
                        <div className={"EditUserData__input"}>
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" name="email" placeholder="Email" />
                        </div>
                        <div className={"EditUserData__input"}>
                            <label htmlFor="password">Kata Sandi:</label>
                            <input type="password" id="password" name="password" placeholder="Password" />
                        </div>
                        <div className={"EditUserData__input"}>
                            <label htmlFor="profilePicture">Foto Profil:</label>
                            <input type="file" id="profilePicture" name="profilePicture" className={"EditUserData__input-file"}/>
                        </div>
                        <button type="submit" className={"EditUserData__submit-button"}>Simpan Perubahan</button>
                    </form>
                </div>
            </div>
        </div>
    </>
  )
}

export default EditUserData;