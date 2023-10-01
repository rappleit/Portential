import styles from "../../styles/skillTree.module.css"
import Map from "./Map";

const SkillTreePage = () => {



    return (
        <div className={styles.subpage}>
            <div className={styles.leftWrapper}>
                <h2>My Skill Map</h2>
                <Map />
            </div>
            <div className={styles.rightWrapper}>
                <h2>Recommended Courses</h2>
            </div>
        </div>
    );
}

export default SkillTreePage;