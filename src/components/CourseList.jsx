import { useState } from 'react';
import { Course } from './Course.jsx';

export const terms = { A:"All", F: 'Fall', W: 'Winter', S: 'Spring'};
export const TermButton = ({term, setTerm, checked}) => 
(
  <>
    <input type="radio" id={term} className="btn-check" checked={checked} autoComplete="off"
      onChange={() => setTerm(term)} />
    <label className ="btn btn-success m-1 p-2" htmlFor={term}>
      { term }
    </label>
  </>
);

export const TermSelector = ({term, setTerm}) => 
(
  <div className="btn-group">
  { 
    Object.values(terms).map
    (value => 
      (
        <TermButton key={value} term={value} setTerm={setTerm} checked={value === term} />
      )
    )
  }
  </div>
);

export const CourseList = ({ courses }) =>
{
  const [term, setTerm] = useState('Fall');
  const termCourses = Object.values(courses).filter(course => term === "All" || term === course.term);
  const [selected, setSelected] = useState([]);
  

  return(
    <>
      <TermSelector term={term} setTerm={setTerm} />
      <div className="course-list">
      { termCourses.map(course => <Course key={course.id || `${course.term}-${course.number}`} course={ course } selected={selected} setSelected={ setSelected }/>) }
      </div>
    </>
  );
};



export default CourseList;