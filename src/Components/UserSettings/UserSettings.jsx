import React, { useEffect, useState } from "react";
import { FaUser, FaArrowLeft } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { CSSTransition } from "react-transition-group";
import EditUserData from "../EditUserData/EditUserData";
import "./UserSettings.css"

import { useNavigate } from "react-router-dom";

import useSignOut from 'react-auth-kit/hooks/useSignOut';

// Firebase SDK
import { auth, db, storage } from "../../Firebase"
// Firebase Firestore SDK
import { getDoc, doc } from "firebase/firestore";
// Firebase Auth SDK
import { signOut } from "firebase/auth";
import { ref, getDownloadURL } from "firebase/storage";

const UserSettings = ( {onBack} ) => {

    const signUserOut = useSignOut();
    const navigateTo = useNavigate();
    const [showEdit, setShowEdit] = useState(false);

    const signAllOut = () => {
        signOut(auth).then(() => {
            signUserOut();
            navigateTo('/');
        }).catch((error) => {
            console.log(error);
        });
    }

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
      

    const getProfilePicture = () => {

        if (userProfile['profilePicture'] == 'default') {
            return (
                <div className={"UserSettings__profile-image--default"}>
                    <FaUser />
                </div>
            );
        } else {
            // Get image from Firebase Storage
            auth.onAuthStateChanged(async (user) => {
              const storageRef = ref(storage, `profilePictures/${user.uid}`);
              const url = await getDownloadURL(storageRef);
              return (<img src={url} alt="" className="ChatContent__profile-image"/>);
            });
          }
        return (<img src={userProfile['profilePicture']} alt="" className="UserSettings__profile-image"/>);
    }

    const handleShowEdit = () => {
        setShowEdit(!showEdit);
    }

    return (
        <div className="UserSettings">
            <div className={"UserSettings__back-button"} onClick={onBack}>
                <FaArrowLeft />
            </div>
            <CSSTransition in={showEdit} timeout={300} classNames={"EditUserData__transition"} unmountOnExit>
                <EditUserData onBack={handleShowEdit}/>
            </CSSTransition>
            <div className="UserSettings__profile">
                <div className="UserSettings__profile-picture">
                    {getProfilePicture()}
                </div>
                <div className="UserSettings__username">
                    {userProfile['username']}
                </div>
                <div className="UserSettings__email">
                    {userProfile['email']}
                </div>
                <button className="UserSettings__edit-button" onClick={handleShowEdit}>
                    Sunting Profil
                </button>
            </div>
            <div className="UserSettings__options">
                <button className="UserSettings__signout-button" onClick={signAllOut}>
                    Sign out <FontAwesomeIcon icon={faArrowRightFromBracket} />
                </button>
            </div>
        </div>
    );
}

export default UserSettings;