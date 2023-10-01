import styles from "../../styles/skillTree.module.css"
import Map from "./Map";
import { FaTrophy } from "react-icons/fa";
import thumbnail1 from "../../assets/courses/thumbnail1.png"

const SkillTreePage = () => {

    return (
        <div className={styles.subpage}>
            <div className={styles.topWrapper}>
                <div className={styles.roadmapWrapper}>
                    <h2>My Upskilling Roadmap</h2>
                    <Map />
                </div>
                <div className={styles.currentSkillsCard}>
                    <h3>My Current Skills</h3>
                    <div className={styles.currentSkillsContainer}>
                        <div className={styles.skillCard}>
                            <FaTrophy color="#e8be00" />
                            <p>Employee Communication</p>
                            <p className={styles.skillAppraisal}>12 Appraisals</p>
                        </div>
                        <div className={styles.skillCard}>
                            <FaTrophy color="#e8be00" />
                            <p>Employee Communication</p>
                            <p className={styles.skillAppraisal}>12 Appraisals</p>
                        </div>
                        <div className={styles.skillCard}>
                            <FaTrophy color="#e8be00" />
                            <p>Employee Communication</p>
                            <p className={styles.skillAppraisal}>12 Appraisals</p>
                        </div>
                        <div className={styles.skillCard}>
                            <FaTrophy color="#e8be00" />
                            <p>Employee Communication</p>
                            <p className={styles.skillAppraisal}>12 Appraisals</p>
                        </div>
                        <div className={styles.skillCard}>
                            <FaTrophy color="#e8be00" />
                            <p>Employee Communication</p>
                            <p className={styles.skillAppraisal}>12 Appraisals</p>
                        </div>
                        <div className={styles.skillCard}>
                            <FaTrophy color="#e8be00" />
                            <p>Employee Communication</p>
                            <p className={styles.skillAppraisal}>12 Appraisals</p>
                        </div>
                        <div className={styles.skillCard}>
                            <FaTrophy color="#e8be00" />
                            <p>Employee Communication</p>
                            <p className={styles.skillAppraisal}>12 Appraisals</p>
                        </div>
                    </div>
                </div>
            </div>
            <h2>Recommended Courses for You</h2>
            <div className={styles.coursesContainer}>
                <div className={styles.courseCard}>
                    <img src={thumbnail1} alt="" />
                    <p>cousera.com</p>
                    <h4>Design Thinking Crash Course</h4>
                    <p>15 hours | 20 lectures | Beginner</p>
                </div>
            </div>

        </div>
    );
}

export default SkillTreePage;