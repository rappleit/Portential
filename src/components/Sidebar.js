import styles from "../styles/sidebar.module.css"
import { MdDashboard, MdPeopleAlt, MdAccountTree, MdFolderSpecial, MdLogout } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import logo from "../assets/logo_small_white.png"


const Sidebar = ({
    handleLogout
}) => {
    return (
        <div className={styles.component}>
            <img src={logo} className={styles.logo} alt="" />
            <div className={styles.linksContainer}>
                <button className={styles.navItem}>
                    <MdDashboard className={styles.navIcon} />
                    <p>Dashboard</p>
                </button>
                <button className={styles.navItem}>
                    <MdFolderSpecial className={styles.navIcon} />
                    <p>PORTfolio</p>
                </button>
                <button className={styles.navItem}>
                    <MdAccountTree className={styles.navIcon} />
                    <p>Skill Tree</p>
                </button>
                <button className={styles.navItem}>
                    <FaTasks className={styles.navIcon} />
                    <p>Tasks</p>
                </button>
                <button className={styles.navItem}>
                    <MdPeopleAlt className={styles.navIcon} />
                    <p>Company</p>
                </button>
            </div>
            <button className={styles.navItem} onClick={() => handleLogout()}>
                <MdLogout className={styles.navIcon}/>
                <p>Logout</p>
            </button>
        </div>
    );
}

export default Sidebar;