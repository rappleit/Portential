import styles from "../styles/portal.module.css"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import {  signOut } from "firebase/auth";


const Portal = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    useEffect(()=>{
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
            console.log("Logged out successfully")
        }).catch((error) => {

        });
    }
    return ( 
        <div className={styles.page}>
            <h1>Hi</h1>
            <button onClick={handleLogout}>
                        Logout
                    </button>
        </div>
     );
}
 
export default Portal;