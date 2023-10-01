import styles from "../../styles/tasks.module.css"
import { FaCircle, FaExclamationCircle, FaEnvelope } from "react-icons/fa";
const Tasks = () => {
    return (
        <div className={styles.subpage}>
            <div className={styles.tasksCard}>
                <div className={styles.cardHeader}>
                    <h2>My Tasks</h2>
                    <button>+ Add Task</button>
                </div>
                <div className={styles.tasksContainer}>
                    <div className={styles.taskItem}>
                        <div className={styles.taskTitle}>
                            <FaCircle color="#09366D"/>
                            <h4>Web Development with Next.js</h4>
                        </div>
                        <div className={styles.taskLabel}>
                            <p>Ongoing certification</p>
                        </div>
                    </div>
                    <div className={styles.taskItem}>
                        <div className={styles.taskTitle}>
                            <FaExclamationCircle color="#FF7276"/>
                            <h4>Review Operations SOP</h4>
                        </div>
                        <div className={`${styles.taskLabel} ${styles.imptTask}`}>
                            <p>HR Issued</p>
                        </div>
                    </div>
                    <div className={styles.taskItem}>
                        <div className={styles.taskTitle}>
                            <FaExclamationCircle color="#FF7276"/>
                            <h4>Write an appraisal for Jane from Web Design Team</h4>
                        </div>
                        <div className={`${styles.taskLabel} ${styles.imptTask}`}>
                            <p>HR Issued</p>
                        </div>
                    </div>
                </div>

            </div>
            <div className={styles.inboxCard}>
                <h2>My Inbox</h2>
                <div className={styles.inboxContainer}>
                    <div className={styles.inboxItem}>
                        <FaEnvelope/>
                        <div>
                            <h4>Your certification has been approved by HR</h4>
                            <p>29 Sept 2023</p>
                        </div>
                    </div>
                    <div className={styles.inboxItem}>
                        <FaEnvelope/>
                        <div>
                            <h4>[HR] Appraisal Period has started</h4>
                            <p>25 Sept 2023</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Tasks;