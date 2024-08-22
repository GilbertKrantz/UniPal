import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import UserSettings from "../UserSettings/UserSettings";
import { CSSTransition } from "react-transition-group";
import "./UserProfile.css"

// Firebase SDK
import { auth, db } from "../../Firebase"
// Firebase Firestore SDK
import { getDoc, doc } from "firebase/firestore";

const UserProfile = () => {

    const [userProfile, setUserProfile] = useState('');
    const [showSettings, setShowSettings] = useState(false);

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
                <div className={"UserProfile__profile-image--default"}>
                    <FaUser />
                </div>
            );
        }

        return (<img src={userProfile['profilePicture']} alt="" className="UserProfile__profile-image"/>);
    }

    const handleShowSettings = () => {
        setShowSettings(!showSettings);
    }

    return (
        <div className="UserProfile">
            <CSSTransition in={showSettings} timeout={200} classNames={'UserSettings__transition'} unmountOnExit>
                <UserSettings onBack={handleShowSettings}/>
            </CSSTransition>
            <div className="UserProfile__container">
                <div className="UserProfile__profile">
                    <div className="UserProfile__profile-picture">
                        {getProfilePicture()}
                    </div>
                    <div className="UserProfile__username">
                        {userProfile['username']}
                    </div>
                    <div className="UserProfile__email">
                        {userProfile['email']}
                    </div>
                    <button className="UserProfile__profile-edit" onClick={handleShowSettings}>
                        Edit Profile
                    </button>
                </div>
                <div className="UserProfile__options">
                    {/* Change password can be done later */}
                    <button className="UserProfile__change-password">
                        Change Password
                    </button>
                    <button className="UserProfile__signout-button">
                        Sign out <FontAwesomeIcon icon={faArrowRightFromBracket} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;