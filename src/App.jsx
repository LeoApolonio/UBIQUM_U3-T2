import React from 'react';
import './App.css';
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useState } from 'react';

const mapValues = (fn, obj) => (
  Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, fn(value)]))
);

const addCourseTimes = course => ({
  ...course,
  ...timeParts(course.meets)
});

const addScheduleTimes = schedule => ({
  title: schedule.title,
  courses: mapValues(addCourseTimes, schedule.courses)
});

const fetchSchedule = async () => 
{
  const url = 'https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php';
  const response = await fetch(url);
  if (!response.ok) throw response;
  return addScheduleTimes(await response.json());
};

const terms = { A:"All", F: 'Fall', W: 'Winter', S: 'Spring'};


const Banner = ({ title }) => 
(
  <h1>{ title }</h1>
);

const TermButton = ({term, setTerm, checked}) => 
(
  <>
    <input type="radio" id={term} className="btn-check" checked={checked} autoComplete="off"
      onChange={() => setTerm(term)} />
    <label className ="btn btn-success m-1 p-2" htmlFor={term}>
      { term }
    </label>
  </>
);

const TermSelector = ({term, setTerm}) => 
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

const toggle = (x, lst) => 
(
  lst.includes(x) ? lst.filter(y => y !== x) : [x, ...lst]
);

const days = ['M', 'Tu', 'W', 'Th', 'F'];



const hasConflict = (course, selected) => 
(
  selected.some(selection => courseConflict(course, selection))
);

const daysOverlap = (days1, days2) => ( 
  days.some(day => days1.includes(day) && days2.includes(day))
);

const hoursOverlap = (hours1, hours2) => (
  Math.max(hours1.start, hours2.start) < Math.min(hours1.end, hours2.end)
);

const timeConflict = (course1, course2) => (
  course1.days && course2.days &&
  daysOverlap(course1.days, course2.days) &&
  hoursOverlap(course1.hours, course2.hours)
);

const courseConflict = (course1, course2) => (
  course1.term === course2.term &&
  timeConflict(course1, course2)
);

const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

const timeParts = meets => 
{
  const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
  return !match ? {} : 
  {
    days,
    hours: 
    {
      start: hh1 * 60 + mm1 * 1,
      end: hh2 * 60 + mm2 * 1
    }
  };
};

//Funciónes sin usar
//=============================================================
// const getCourseTerm = course => 
// (
//   terms[course.id.charAt(0)]
// );

// const getCourseNumber = course => 
// (
//   course.id.slice(1, 4)
// );
//=============================================================

const Course = ({ course , selected, setSelected}) =>
{
  const isSelected = selected.includes(course);
  const isDisabled = !isSelected && hasConflict(course, selected);
  const style = {
    backgroundColor: isDisabled? 'lightgrey' : isSelected ? 'lightgreen' : 'white'
  };
  return(
    <div className="card m-1 p-2" style={style} onClick={() => isDisabled ? null : setSelected(toggle(course, selected))}>
      
      <div className="card-body">
        <div className="card-title">
          {course.term} CS {course.number}
        </div>
        
        <div className="card-text">
          {course.title}
        </div>

        <hr />

        <div className="card-text">
          {course.meets}
        </div>
      
      </div>
    </div>
);}
  

const CourseList = ({ courses }) =>
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



// Esto no se ocupa ya, solo sirvió de forma local.

// const schedule = 
// {
//   "title": "CS Courses for 2018-2019",
//   "courses": 
//   {
//     "F101" : 
//     {
//       "id" : "F101",
//       "meets" : "MWF 11:00-11:50",
//       "title" : "Computer Science: Concepts, Philosophy, and Connections"
//     },
    
//     "F110" : 
//     {
//       "id" : "F110",
//       "meets" : "MWF 10:00-10:50",
//       "title" : "Intro Programming for non-majors"
//     },
    
//     "S313" : 
//     {
//       "id" : "S313",
//       "meets" : "TuTh 15:30-16:50",
//       "title" : "Tangible Interaction Design and Learning"
//     },
    
//     "S314" : 
//     {
//       "id" : "S314",
//       "meets" : "TuTh 9:30-10:50",
//       "title" : "Tech & Human Interaction"
//     },
    
//     "S316" : 
//     {
//       "id" : "S316",
//       "meets" : "Mon 11:30-13:50",
//       "title" : "Yes"
//     }

//   }
// };

// const App = () => 
// (
//   <div className="container">
//     <Banner title={ schedule.title } />
//     <CourseList courses={ schedule.courses } />
//   </div>
// );

const Main = () => 
{
  const { data, isLoading, error } = useQuery( 
    {
      queryKey: ['schedule'],
      queryFn: fetchSchedule
    });

  if (error) return <h1>Error al cargar schedule</h1>;
  if (isLoading) return <h1>Cargando schedule...</h1>;

  return(
    <div className="container">
      <Banner title={ data.title } />
      <CourseList courses={ data.courses } />
    </div>
  );
};

const queryClient = new QueryClient();

const App = () => 
(
  <QueryClientProvider client={queryClient}>
    <Main />
  </QueryClientProvider>
);

export default App;