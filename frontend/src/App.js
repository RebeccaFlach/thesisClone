import logo from './logo.svg';
import './App.css';
import React from 'react'

const App = () => {
  const [grades, setGrades] = React.useState([]);

  React.useEffect(() => {
    console.log('running')
    const Http = new XMLHttpRequest();
    const url='http://localhost:5000/api/test/helloWorld';
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
      //console.log(JSON.parse(Http.responseText).message)
      setGrades(JSON.parse(Http.responseText).message)
    }

    const gradeGetter = new XMLHttpRequest();
    const gradeUrl ='http://localhost:5000/api/grade/grades';
    gradeGetter.open("GET", gradeUrl);
    gradeGetter.send();

    gradeGetter.onreadystatechange = (e) => {
      console.log(gradeGetter.responseText)
      
    }
  }, [])

  return (
    <div className="App">
      {/* {grades && grades.map(grade => <Grade grade={grade} />)} */}
      {grades}
    </div>
  );
}

const Grade = (props) => {
  return <p> {props.grade} </p>
}

export default App;
