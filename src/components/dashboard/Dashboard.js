import { useEffect, useState } from "react";
import styles from "../../styles/dashboard.module.css"
import { getDatabase, ref, onValue } from "firebase/database";
import port from "../../assets/port.svg"
import { FaTasks } from "react-icons/fa";
import { MdRateReview, MdDocumentScanner } from "react-icons/md";
import { SiTarget } from "react-icons/si";
import graph from "../../assets/graph.png"
import thumbnail1 from "../../assets/courses/thumbnail1.png"
import thumbnail2 from "../../assets/courses/thumbnail2.png"
import thumbnail3 from "../../assets/courses/thumbnail3.png"


const Dashboard = ({
    user
}) => {
    const [profile, setProfile] = useState({});
    const db = getDatabase();

    useEffect(() => {
        if (user != null) {
            const userRef = ref(db, 'users/' + user.uid);
            onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                setProfile(data)

            });
        }
    }, [user])


    return (
        <div className={styles.subpage}>
            <div className={styles.leftWrapper}>
                <div className={styles.welcomeCard}>
                    <div>
                        <h2>Welcome {profile.name}!</h2>
                        <p>You have 4 pending tasks</p>
                    </div>
                    <img src={port} alt="" />
                </div>
                <div className={styles.actionWrapper}>
                    <button className={styles.actionCard}>
                        <div className={styles.actionIcon}>
                            <FaTasks />
                        </div>
                        <p>Check Tasks</p>
                    </button>
                    <button className={styles.actionCard}>
                        <div className={styles.actionIcon}>
                            <MdDocumentScanner />
                        </div>
                        <p>Review Protocols</p>
                    </button>
                    <button className={styles.actionCard}>
                        <div className={styles.actionIcon}>
                            <SiTarget />
                        </div>
                        <p>Practice Skills</p>
                    </button>
                    <button className={styles.actionCard}>
                        <div className={styles.actionIcon}>
                            <MdRateReview />
                        </div>
                        <p>Give Appraisals</p>
                    </button>
                </div>
                <div className={styles.progressCard}>
                    <div className={styles.leftProgress}>
                        <h3>Progress Overview</h3>

                        <div className={styles.progressItem}>
                            <p>Skills learnt this month</p>
                            <h3>4</h3>
                        </div>
                        <div className={styles.progressItem}>
                            <p>Total time spent</p>
                            <h3>90 hours</h3>
                        </div>
                    </div>
                    <div className={styles.rightProgress}>
                        <img src={graph} alt="" />
                    </div>

                </div>
            </div>
            <div className={styles.rightWrapper}>
                <div className={styles.forYouCard}>
                    <h3>Courses For You</h3>
                    <div className={styles.courseContainer}>
                        <div className={styles.courseCard}>
                            <img src={thumbnail1} alt="" />
                            <p>cousera.com</p>
                            <h4>Design Thinking Crash Course</h4>
                            <p>15 hours | 20 lectures | Beginner</p>
                        </div>
                        <div className={styles.courseCard}>
                            <img src={thumbnail2} alt="" />
                            <p>udemy.com</p>
                            <h4>Shipping and Crewing Manager Course</h4>
                            <p>25 hours | 41 lectures | All Levels</p>
                        </div>
                        <div className={styles.courseCard}>
                            <img src={thumbnail3} alt="" />
                            <p>udemy.com</p>
                            <h4>Blockchain and Smart Contracts</h4>
                            <p>20 hours | 28 lectures | Advanced</p>
                        </div>
                    </div>


                </div>
            </div>


        </div>
    );
}

export default Dashboard;