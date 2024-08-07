import React from 'react'
import './EditUserData.css'

// Firebase SDK
import { auth, db, storage } from "../../Firebase"
// Firebase Firestore SDK
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const user = auth.currentUser;
const storageRef = ref(storage, `profilePictures/${user.uid}`);

const EditUserData = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const profilePicture = e.target.profilePicture.files[0];
        
        auth.onAuthStateChanged(async (user) => {
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
            <div className={"EditUserData__container--inner"}>
                <div className={"EditUserData__container--inner--header"}>
                    <h1>Edit User Data</h1>
                </div>
                <div className={"EditUserData__container--inner--content"}>
                    <form>
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" name="username" placeholder="Username" />
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" placeholder="Email" />
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" placeholder="Password" />
                        <label htmlFor="profilePicture">Profile Picture:</label>
                        <input type="file" id="profilePicture" name="profilePicture" />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </>
  )
}

export default EditUserData