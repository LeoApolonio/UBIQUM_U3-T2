import React from 'react';
import './App.css';
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";


const fetchSchedule = async () => {
  const url = 'https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php';
  const response = await fetch(url);
  if (!response.ok) throw response;
  return await response.json();
};

const terms = { F: 'Fall', W: 'Winter', S: 'Spring'};


const Banner = ({ title }) => 
(
  <h1>{ title }</h1>
);

//Función sin usar
const getCourseTerm = course => 
(
  terms[course.id.charAt(0)]
);

//Función sin usar
const getCourseNumber = course => 
(
  course.id.slice(1, 4)
);

const Course = ({ course }) => 
(
  <div className="card m-1 p-2">
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
);

const CourseList = ({ courses }) => 
(
  <div className="course-list">
    {
      Object.entries(courses).map
      (
        ([id, course]) => 
        (
          <Course key={id} course={{ ...course, id }}/>
        )
      )
    }
  </div>
);

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

const Main = () => {
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Main />
  </QueryClientProvider>
);



export default App;