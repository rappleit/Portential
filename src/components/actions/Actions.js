import { useEffect, useState } from "react";
import styles from "../../styles/actions.module.css"
import { MdRateReview, MdDocumentScanner } from "react-icons/md";
import { SiTarget } from "react-icons/si";
import { getDatabase, onValue, push, ref } from "firebase/database";
import { Store } from 'react-notifications-component';

const Actions = ({
    user,
    actionPage,
    setActionPage
}) => {

    const [appraiseeList, setAppraiseeList] = useState([])
    const [feedback, setFeedback] = useState("")
    const [appraiseeID, setAppraiseeID] = useState("")
    const [appraiseeName, setAppraiseeName] = useState("")
    const [profile, setProfile] = useState({});

    const db = getDatabase();

    useEffect(() => {
        if (user != null) {
            const userRef = ref(db, 'users/');

            onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                setAppraiseeList(data)
            });
            const profileRef = ref(db, 'users/' + user.uid);

            onValue(profileRef, (snapshot) => {
                const data = snapshot.val();
                setProfile(data)
            });
        }
    }, [user])

    const handleAppraisalForm = (e) => {
        e.preventDefault()
        push(ref(db, 'users/' + appraiseeID + '/appraisals/'), {
            author: profile.name,
            feedback: feedback
        }).then(() => {
            setFeedback("")
            setAppraiseeID("")
            setAppraiseeName("")
            setActionPage("main")
            Store.addNotification({
                title: "Success",
                message: "Your feedback has been received",
                type: "success",
                container: "bottom-right",
                dismiss: {
                    duration: 5000,
                    onScreen: true
                }
            });
        }).catch((error) => {
            Store.addNotification({
                title: "Error",
                message: error.message,
                type: "danger",
                container: "bottom-right",
                dismiss: {
                    duration: 5000,
                    onScreen: true
                }
            });
        })
    }

    return (
        <div className={styles.subpage}>
            {(actionPage === "main") ?
                <div className={styles.actionpage}>
                    <h2>Actions</h2>
                    <div className={styles.actionsContainer}>
                        <button onClick={() => setActionPage("appraisal")} className={styles.actionCard}>
                            <MdRateReview size={45} color="#09366D" />
                            <h4>Write an appraisal</h4>
                        </button>
                        <button className={styles.actionCard}>
                            <MdDocumentScanner size={45} color="#09366D" />
                            <h4>Review Protocols</h4>
                        </button>
                        <button className={styles.actionCard}>
                            <SiTarget size={45} color="#09366D" />
                            <h4>Practice Skills</h4>
                        </button>
                    </div>
                </div> : <></>}
            {(actionPage === "appraisal") ?
                <div className={styles.actionpage}>
                    <div className={styles.actionpageHeader}>
                        <h2>Write an appraisal</h2>
                        <button onClick={() => setActionPage("main")}>Back</button>
                    </div>

                    <div className={styles.appraisalWrapper}>
                        <div className={styles.appraisalListCard}>
                            <h3>Colleagues to appraise (2)</h3>
                            {(Object.keys(appraiseeList).length != 0) ?
                                Object.keys(appraiseeList).map((ap, i) => (
                                    <div className={styles.appraiseeCard} key={i} onClick={() => {
                                        setAppraiseeID(ap);
                                        setAppraiseeName(appraiseeList[ap].name)
                                        }}>
                                        <h3>{appraiseeList[ap].name}</h3>
                                        <p>{appraiseeList[ap].role}</p>
                                        <p>{appraiseeList[ap].team}</p>
                                    </div>
                                ))
                                : <></>}

                        </div>
                        <div className={styles.appraisalFormContainer}>
                            <h2>Appraisal Form</h2>
                            <h4>Name of Appraisee: {appraiseeName}</h4>
                            <form className={styles.appraisalForm}>
                                <h4>Feedback</h4>
                                <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} />
                                <button type="submit" onClick={(e) => handleAppraisalForm(e)}>Submit</button>
                            </form>
                        </div>
                    </div>
                </div> : <></>
            }

        </div>
    );
}

export default Actions;