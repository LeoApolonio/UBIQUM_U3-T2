import React from 'react';
import './App.css';
import {QueryClient, QueryClientProvider, useQuery} from "@tanstack/react-query";
//import {fetchSchedule} from './utilities/times.jsx';
import {CourseList} from './components/CourseList.jsx';
import { useData } from './utilities/firebase.jsx';
import { addScheduleTimes } from './utilities/times.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EditForm from './EditForm';

const Banner = ({ title }) => 
(
  <h1>{ title }</h1>
);

const Main = () => 
{
  const [schedule, loading, error] = useData('/', addScheduleTimes);

  if (error) return <h1>Error al cargar schedule</h1>;
  if (loading) return <h1>Cargando schedule...</h1>;

  return (
    <div className="container">
      <Banner title={ schedule.title } />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CourseList courses={ schedule.courses } />} />
          <Route path="/edit" element={ <EditForm /> } />
        </Routes>
      </BrowserRouter>
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

// Esto no se ocupa ya, solo sirvió de forma local.

//=============================================================
// const getCourseTerm = course => 
// (
//   terms[course.id.charAt(0)]
// );
//=============================================================
// const getCourseNumber = course => 
// (
//   course.id.slice(1, 4)
// );
//=============================================================
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
//=============================================================
// const App = () => 
// (
//   <div className="container">
//     <Banner title={ schedule.title } />
//     <CourseList courses={ schedule.courses } />
//   </div>
// );
//=============================================================
