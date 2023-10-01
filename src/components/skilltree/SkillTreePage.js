import styles from "../../styles/skillTree.module.css"
import Map from "./Map";
import { FaTrophy } from "react-icons/fa";
import thumbnail1 from "../../assets/courses/thumbnail1.png"
import { useEffect, useState } from "react";
import { getDatabase, onValue, ref } from "firebase/database";

const SkillTreePage = ({ user }) => {
    const [skills, setSkills] = useState('');
    const [courses, setCourses] = useState('');

    const [feedback, setFeedback] = useState("")
    const db = getDatabase();
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (user != null) {
            const feedbackRef = ref(db, 'users/' + user.uid + '/appraisals');
            onValue(feedbackRef, (snapshot) => {
                const data = snapshot.val();
                if (Object.keys(data).length > 0) {
                    let lastFeedback = data[Object.keys(data)[0]].feedback
                    setFeedback(lastFeedback);
                    console.log(data[Object.keys(data)[0]].feedback)
                }
            });
        }
    }, [user])

    useEffect(() => {
        if (feedback != "") {
            generate(feedback);
        }
    }, [feedback])

    const generate = async (comments) => {
        setIsLoading(true);
        console.log("loading...")
        let options = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*'
            }),
            body: comments
        };
        options.body = JSON.stringify({ 'text': comments });
        await fetch('https://Portential.pythonanywhere.com/api', options)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setCourses(data['courses']); // TODO change to parse with JSON and process further
                setSkills(data['roadmap'])
                setIsLoading(false);
            })
            .catch(e => console.log(e));
    };


    return (
        <div className={styles.subpage}>
            <div className={styles.topWrapper}>
                <div className={styles.roadmapWrapper}>
                    <h2>My Upskilling Roadmap</h2>
                    {(skills != "" && isLoading != true) ? <Map {...{ skills }} /> : <h2>Loading...</h2>}
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
                            <p>Port Operations</p>
                            <p className={styles.skillAppraisal}>12 Appraisals</p>
                        </div>
                        <div className={styles.skillCard}>
                            <FaTrophy color="#e8be00" />
                            <p>Decision Making</p>
                            <p className={styles.skillAppraisal}>12 Appraisals</p>
                        </div>
                        <div className={styles.skillCard}>
                            <FaTrophy color="#e8be00" />
                            <p>Analytical Skills</p>
                            <p className={styles.skillAppraisal}>12 Appraisals</p>
                        </div>
                        <div className={styles.skillCard}>
                            <FaTrophy color="#e8be00" />
                            <p>Reactjs</p>
                            <p className={styles.skillAppraisal}>12 Appraisals</p>
                        </div>
                        <div className={styles.skillCard}>
                            <FaTrophy color="#e8be00" />
                            <p>Microsoft Excel</p>
                            <p className={styles.skillAppraisal}>12 Appraisals</p>
                        </div>
                        <div className={styles.skillCard}>
                            <FaTrophy color="#e8be00" />
                            <p>Python3</p>
                            <p className={styles.skillAppraisal}>12 Appraisals</p>
                        </div>
                    </div>
                </div>
            </div>
            <h2>Recommended Courses for You</h2>
            <div className={styles.coursesContainer}>
                {(!isLoading && skills != "") ? JSON.parse(courses).map((course, i) => (
                    <a href={course["Course URL"]} target="_blank" rel="noreferrer" key={i}>
                        <div className={styles.courseCard}  >
                            <img src={thumbnail1} alt="" />
                            <p>cousera.com</p>
                            <h4>{course["Course Name"]}</h4>
                            <p>15 hours | 20 lectures | {course["Difficulty Level"]}</p>
                        </div>
                    </a>

                )) : <h3>Loading...</h3>}


            </div>

        </div>
    );
}

export default SkillTreePage;