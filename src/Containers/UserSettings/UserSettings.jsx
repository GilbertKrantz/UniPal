import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import './UserSettings.css'

const UserSettings = ({ onBack }) => {

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
                <div className={"UserProfile__profile-image--default"}>
                    <FaUser />
                </div>
            );
        }

        return (<img src={userProfile['profilePicture']} alt="" className="UserProfile__profile-image"/>);
    }

    const validateName = (name) => {
        // if name is empty, have a number, and have a special character, return false
        if (name === "") {
            return "No Name";
        } else if (name.match(/\d+/g) || name.match(/[^a-zA-Z0-9]/g)) {
            return "Invalid Name";
        }
        return true;
    }

    return(
        <div className="UserSettings">
            <button className="UserSettings__back-button" onClick={onBack}>
                <FaArrowLeft />
            </button>
            <div className="UserSettings__form-container">
                <form action="" className="UserSettings__form">
                    {/* <div className="UserSettings__profile-picture">
                        {getProfilePicture()}
                    </div> */}

                    <div className="UserSettings__input-container">
                        <label htmlFor="name" className="UserSettings__input-label">Nama</label>
                        <input
                            autoComplete="off"
                            type="text"
                            id="name"
                            className="UserSettings__input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        {/* Error if name isn't valid */}
                       {validateName(name) !== true && <p className="UserSettings__error">{validateName(name)}</p>}
                    </div>

                    <button type='submit' className="UserSettings__submit-button">Save Changes</button>
                </form>
            </div>
        </div>
    );
}

export default UserSettings;