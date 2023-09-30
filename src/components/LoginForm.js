import styles from "../styles/login.module.css"

const LoginForm = () => {
    return (
        <div className={styles.form}>
            <h2>Login</h2>
            <form>
                <div className={styles.formItem}>
                    <label>Company Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                    ></input>
                </div>
                <div className={styles.formItem}>
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                    ></input>
                </div>
            <button type="submit">Log In</button>
            </form>
        </div>
    );
}

export default LoginForm;