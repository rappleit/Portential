import React, { useState } from "react";

export default function Recommender () {
    const [comments, setComments] = useState('');
    const [skills, setSkills] = useState('');
    const [courses, setCourses] = useState('');

    const generate = async () => {
        if (comments === '') {
            window.alert('Please enter your comments in the input field provided.');
            return;
        }
        else if (courses !== '') {
            setCourses(''); // Reset courses if needed
            setSkills('');
        }
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
        await fetch('http://127.0.0.1:5000/api', options)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setCourses(data['courses']); // TODO change to parse with JSON and process further
                setSkills(data['roadmap'])
            })
            .catch(e => console.log(e));
    };

    return (
        <div>
            <input placeholder='Enter evaluation comments here!' onChange={event => setComments(event.target.value)}/>
            <button onClick={generate}>Find courses!</button>
            <input placeholder='Skills' value={skills} readOnly/>
            <input placeholder='Recommended courses will show here!' value={courses} readOnly/>
        </div>
    );
}