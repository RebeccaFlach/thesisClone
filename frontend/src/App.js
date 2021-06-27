import './App.css';
import React from 'react';
import axios from 'axios';

const App = () => {
  const [grades, setGrades] = React.useState([]);
  const [gradePeriod, setGradePeriod] = React.useState(0)
  const [name, setName] = React.useState();
  const [pass, setPass] = React.useState();


  const axiosConfig = {withCredentials: true}
  const gradeUrl ='https://mren-na1-localhost.io:6001/api/grade/';
  const login = () => {
    axios.get(gradeUrl + 'login/' + name + '/' + pass, axiosConfig).then(console.log)
  }

  const getGrades = () => {
    axios.get(gradeUrl + 'grades/' + gradePeriod, axiosConfig)
      .then((res) => {
        console.log(res)
        setGrades(res.data)
    })
  }


  // menu popout from hamburger- history (report cards, course history, gpa), attendance, about, support
  return (
    <div className="App">
      {/* <button onClick={() => {setGradePeriod(1)}}> 
        1st Quarter
      </button> */}
      <input onBlur={(e) => {
        setName(e.target.value)
        
        }} />
      <input onBlur={(e) => {
        setPass(e.target.value)
        
        }} />
      <button onClick={getGrades}>GET GRADES</button>
      <button onClick={login}> login</button>
      {grades.length > 0 && grades.map(course => <Grade grade={course.grade} title={course.title} letterGrade={course.letterGrade}/>)}
      {/* {grades} */}
    </div>
  );
}
//do a little bar on the side with a color for letter grade
const Grade = (props) => {
  const GradeBar = () => {
    let color;
    switch(props.letterGrade){
      case 'A': 
        color = '#63ff00';
        break;
      case 'B':
        color = '#d6ff00';
        break;
      case 'C': 
        color = '#ffff00';
        break;
      case 'D':
        color = '#ffc100';
        break;
      default: 
        color = '#ff0000';
    }
    return <span style={{backgroundColor: color, height: '100%', width: '10px'}}> </span>
  }


  const title = props.title.length > 20 ? props.title.substring(0, 20) + '...' : props.title
  
  return <div className='course-grade'>
    <GradeBar /><span> {title} </span> <span> { props.grade } </span>
  </div>
}



export default App;
