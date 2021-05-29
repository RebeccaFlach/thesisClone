import logo from './logo.svg';
import './App.css';
import React from 'react'

const App = () => {
  const [grades, setGrades] = React.useState([]);

  React.useEffect(() => {
    console.log('running')
    const Http = new XMLHttpRequest();
    const url='http://localhost:5000/';
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
      console.log(Http.responseText.split(' '))
      setGrades(Http.responseText.split(' '))
    }
  }, [])

  return (
    <div className="App">
      {grades && grades.map(grade => <Grade grade={grade} />)}
      {/* grades */}
    </div>
  );
}

const Grade = (props) => {
  return <p> {props.grade} </p>
}

export default App;
