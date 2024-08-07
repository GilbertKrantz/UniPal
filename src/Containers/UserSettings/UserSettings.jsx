import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import "./UserSettings.css"

// Firebase SDK
import { auth, db } from "../../Firebase"
// Firebase Firestore SDK
import { getDoc, doc } from "firebase/firestore";

const UserSettings = () => {

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
        }

        return (<img src={userProfile['profilePicture']} alt="" className="UserSettings__profile-image"/>);
    }

    return (
        <div className="UserSettings">
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
            </div>
            <div className="UserSettings__options">
                <button className="UserSettings__signout-button">
                    Sign out <FontAwesomeIcon icon={faArrowRightFromBracket} />
                </button>
            </div>
        </div>
    );
}

export default UserSettings;