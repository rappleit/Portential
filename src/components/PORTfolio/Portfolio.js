import { getDatabase, onValue, ref } from "firebase/database";
import styles from "../../styles/portfolio.module.css"
import { useEffect, useState } from "react";
import { FaHandshake, FaCertificate } from "react-icons/fa";

const Portfolio = ({
    user
}) => {
    const [profile, setProfile] = useState({});
    const db = getDatabase();

    const [selectedCat, setSelectedCat] = useState("all")
    const [selectedSkillCat, setSelectedSkillCat] = useState("all")

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
            <h2>My PORTfolio</h2>
            <div className={styles.mainWrapper}>
                <div className={styles.leftWrapper}>
                    <div className={styles.profileCard}>
                        <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Bear" alt="avatar" />
                        <h3>{profile.name}</h3>
                        <p>{profile.role}</p>
                        <p>{profile.team}</p>
                        <a className={styles.email} href={`mailto:${profile.email}`}>{profile.email}</a>
                        <div className={styles.divider}></div>
                        <div className={styles.profileItem}>
                            <p>Length of Service</p>
                            <h3>4 years</h3>
                        </div>
                        <div className={styles.profileItem}>
                            <p>Certifications</p>
                            <h3>3</h3>
                        </div>
                        <div className={styles.profileItem}>
                            <p>Skills</p>
                            <h3>20</h3>
                        </div>

                    </div>
                </div>
                <div className={styles.rightWrapper}>
                    <div className={styles.certCard}>
                        <div className={styles.cardHeader}>
                            <h3>My Certifications and Licenses</h3>
                            <button> + Add Certification</button>
                        </div>
                        <div className={styles.categoryContainer}>
                            <button onClick={() => setSelectedCat("all")} className={(selectedCat === "all") ? styles.selectedButton : ""}>All</button>
                            <button onClick={() => setSelectedCat("softskills")} className={(selectedCat === "softskills") ? styles.selectedButton : ""}>Soft Skills</button>
                            <button onClick={() => setSelectedCat("industry")} className={(selectedCat === "industry") ? styles.selectedButton : ""}>Industry Knowledge</button>
                            <button onClick={() => setSelectedCat("tools")} className={(selectedCat === "tools") ? styles.selectedButton : ""}>Tools & Technology</button>
                            <button onClick={() => setSelectedCat("languages")} className={(selectedCat === "languages") ? styles.selectedButton : ""} >Languages</button>
                        </div>
                        <div className={styles.certsContainer}>
                            <div className={styles.cert}>
                                <img src="https://ui-avatars.com/api/?background=random&name=S" alt=""/>
                                <div>
                                    <h4>Specialist Diploma in Port Management and Operations</h4>
                                    <p>Singapore Polytechnic</p>
                                    <p>Issued Nov 2021</p>
                                    <p><span style={{fontWeight: "bold"}}>Skills: </span>Port Operations | Forklift Operations | Crane Operations </p>
                                </div>
                            </div>
                            <div className={styles.cert}>
                                <img src="https://ui-avatars.com/api/?background=random&name=FA" alt=""/>
                                <div>
                                    <h4>First Aid and CPR Certification </h4>
                                    <p>Singapore First Aid Training</p>
                                    <p>Issued Jan 2022</p>
                                    <p><span style={{fontWeight: "bold"}}>Skills: </span>CPR | First Aid</p>
                                </div>
                            </div>
                            <div className={styles.cert}>
                                <img src="https://ui-avatars.com/api/?background=random&name=AI" alt=""/>
                                <div>
                                    <h4>AI FOR INDUSTRY - Literacy in AI</h4>
                                    <p>AI Singapore</p>
                                    <p>Issued May 2022</p>
                                    <p><span style={{fontWeight: "bold"}}>Skills: </span>Artificial Intelligence (AI)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.skillsCard}>
                        <div className={styles.cardHeader}>
                            <h3>My Skills</h3>
                            <button> + Add Skill</button>
                        </div>
                        <div className={styles.categoryContainer}>
                            <button onClick={() => setSelectedSkillCat("all")} className={(selectedSkillCat === "all") ? styles.selectedButton : ""}>All</button>
                            <button onClick={() => setSelectedSkillCat("softskills")} className={(selectedSkillCat === "softskills") ? styles.selectedButton : ""}>Soft Skills</button>
                            <button onClick={() => setSelectedSkillCat("industry")} className={(selectedSkillCat === "industry") ? styles.selectedButton : ""}>Industry Knowledge</button>
                            <button onClick={() => setSelectedSkillCat("tools")} className={(selectedSkillCat === "tools") ? styles.selectedButton : ""}>Tools & Technology</button>
                            <button onClick={() => setSelectedSkillCat("languages")} className={(selectedSkillCat === "languages") ? styles.selectedButton : ""} >Languages</button>
                        </div>
                        <div className={styles.skillsContainer}>
                            <div className={styles.skillItem}>
                                <h4>Employee Communication</h4>
                                <div className={styles.skillInfo}>
                                    <div className={styles.skillInfoItem}>
                                        <FaHandshake/>
                                        <p>12 appraisals</p>
                                    </div>
                                    <div className={styles.skillInfoItem}>
                                        <FaCertificate/>
                                        <p>1 certificate</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.skillItem}>
                                <h4>Port Operations</h4>
                                <div className={styles.skillInfo}>
                                    <div className={styles.skillInfoItem}>
                                        <FaHandshake/>
                                        <p>12 appraisals</p>
                                    </div>
                                    <div className={styles.skillInfoItem}>
                                        <FaCertificate/>
                                        <p>1 certificate</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.skillItem}>
                                <h4>Decision Making</h4>
                                <div className={styles.skillInfo}>
                                    <div className={styles.skillInfoItem}>
                                        <FaHandshake/>
                                        <p>12 appraisals</p>
                                    </div>
                                    <div className={styles.skillInfoItem}>
                                        <FaCertificate/>
                                        <p>1 certificate</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.skillItem}>
                                <h4>Analytical Skills</h4>
                                <div className={styles.skillInfo}>
                                    <div className={styles.skillInfoItem}>
                                        <FaHandshake/>
                                        <p>12 appraisals</p>
                                    </div>
                                    <div className={styles.skillInfoItem}>
                                        <FaCertificate/>
                                        <p>1 certificate</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Portfolio;