import { hasConflict, toggle } from '../utilities/times.jsx';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useUserState } from '../utilities/firebase.jsx';

export const Course = ({ course , selected, setSelected}) =>
{
    const navigate = useNavigate();
    const isSelected = selected.includes(course);
    const isDisabled = !isSelected && hasConflict(course, selected);
    const [user] = useUserState();
    const style = {
        backgroundColor: isDisabled? 'lightgrey' : isSelected ? 'lightgreen' : 'white'
    };
  return(
    <div className="card m-1 p-2" style={style} 
        onClick={() => isDisabled ? null : setSelected(toggle(course, selected))}
        onDoubleClick={!user ? null : () => navigate('/edit', { state: course })}
    >
      
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