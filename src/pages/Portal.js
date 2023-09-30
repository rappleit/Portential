import styles from "../styles/portal.module.css"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { signOut } from "firebase/auth";
import Sidebar from "../components/Sidebar";
import { Store } from 'react-notifications-component';


const Portal = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    useEffect(() => {
        onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                setUser(authUser)
            } else {
                navigate("/")
            }
        });

    }, [])

    const handleLogout = () => {
        signOut(auth).then(() => {
            navigate("/");
            Store.addNotification({
                title: "Success",
                message: "You have been logged out successfully",
                type: "success",
                container: "bottom-right",
                dismiss: {
                  duration: 5000,
                  onScreen: true
                }
              });

        }).catch((error) => {
            Store.addNotification({
                title: "Error",
                message: error.message,
                type: "danger",
                container: "bottom-right",
                dismiss: {
                    duration: 5000,
                    onScreen: true
                }
            });
        });
    }
    return (
        <div className={styles.page}>
            <Sidebar {...{ handleLogout }} />

        </div>
    );
}

export default Portal;