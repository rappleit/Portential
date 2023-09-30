import LoginForm from "../components/LoginForm";
import styles from "../styles/login.module.css"
const Login = () => {
    return ( 
        <div className={styles.page}>
            <div className={styles.bg}></div>
            <div className={styles.card}>
                <LoginForm/>
            </div>
        </div>
     );
}
 
export default Login;