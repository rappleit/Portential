import { useState } from "react";
import styles from "../styles/login.module.css"
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { Store } from 'react-notifications-component';
import { auth } from "../firebase";
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            navigate("/portal")
        })
        .catch((error) => {
            console.error(error.message);
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
        })
    };
    return ( 
        <div className={styles.page}>
            <div className={styles.bg}></div>
            <div className={styles.card}>
            <div className={styles.form}>
            <h2>Login</h2>
            <form>
                <div className={styles.formItem}>
                    <label>Company Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    ></input>
                </div>
                <div className={styles.formItem}>
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    ></input>
                </div>
                <button type="submit" onClick={(e) => handleLogin(e)}>Log In</button>
            </form>
        </div>
                
            </div>
        </div>
     );
}
 
export default Login;