import React from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Backdrop from "../../Components/Backdrop/Backdrop";
import { motion } from "framer-motion";
import './ConfirmSignOut.css'


const dropIn = {
    hidden: {
        y: '-100vh',
        opacity: 0,
    },
    visible: {
        y: '0',
        opacity: 1,
        transition: {
            duration: 0.1,
            type: 'spring',
            damping: 50,
            stiffness: 500,
        },
    },
    exit: {
        y: '100vh',
        opacity: 0
    }
}

const ConfirmSignOut = ({ handleClose, confirm }) => {
    
    const handleSignOut = () => {
        confirm();
    }

    return (
        <Backdrop onClick={handleClose}>
            <motion.div
                drag={true}
                onClick={(e) => e.stopPropagation()}
                className="ConfirmSignOut"
                variants={dropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <button className="ConfirmSignOut__exit-button" onClick={handleClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <div className="ConfirmSignOut__content">
                    <div className="ConfirmSignOut__header">
                        Apakah kamu yakin ingin keluar?
                    </div>
                    <div className="ConfirmSignOut__confirmation-button-container">
                        <button className="ConfirmSignOut__confirmation-button" onClick={handleSignOut}>
                            Iya
                        </button>
                        <button className="ConfirmSignOut__confirmation-button" onClick={handleClose}>
                            Tidak
                        </button>
                    </div>
                </div>
            </motion.div>
        </Backdrop>
    );
}

export default ConfirmSignOut;