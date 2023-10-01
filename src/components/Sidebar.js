import styles from "../styles/sidebar.module.css"
import { MdDashboard, MdPeopleAlt, MdAccountTree, MdFolderSpecial, MdLogout } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import logo from "../assets/logo_small_white.png"


const Sidebar = ({
    handleLogout,
    page,
    setPage
}) => {
    return (
        <div className={styles.component}>
            <img src={logo} className={styles.logo} alt="" />
            <div className={styles.linksContainer}>
                <button onClick={()=>setPage("dashboard")} className={`${styles.navItem} ${(page === "dashboard") ? styles.navItemSelected: ''}`}>
                    <MdDashboard className={styles.navIcon} />
                    <p>Dashboard</p>
                </button>
                <button onClick={()=>setPage("portfolio")} className={`${styles.navItem} ${(page === "portfolio") ? styles.navItemSelected: ''}`}>
                    <MdFolderSpecial className={styles.navIcon} />
                    <p>PORTfolio</p>
                </button>
                <button onClick={()=>setPage("skilltree")} className={`${styles.navItem} ${(page === "skilltree") ? styles.navItemSelected: ''}`}>
                    <MdAccountTree className={styles.navIcon} />
                    <p>Skill Map</p>
                </button>
                <button onClick={()=>setPage("tasks")} className={`${styles.navItem} ${(page === "tasks") ? styles.navItemSelected: ''}`}>
                    <FaTasks className={styles.navIcon} />
                    <p>Tasks</p>
                </button>
                <button onClick={()=>setPage("actions")} className={`${styles.navItem} ${(page === "actions") ? styles.navItemSelected: ''}`}>
                    <MdPeopleAlt className={styles.navIcon} />
                    <p>Actions</p>
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