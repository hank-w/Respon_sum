import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Student, ID } from './types/api';
import { getStudentId, createStudent } from './api/students';
import { BrowserRouter } from 'react-router-dom';


function App() {
  const [studentId, setStudentId] = useState<ID>('');
  const [student, setStudent] = useState<Student>();

  const [postStudent, setPostStudent] = useState<string>('');
  const [postResult, setPostResult] = useState<string>('');

  const onButtonPress = async () => {
    setStudent((await getStudentId(studentId)).data);
  };

  const onPostButtonPress = async () => {
    console.log(postStudent);
    console.log(JSON.parse(postStudent));
    const response = await createStudent(JSON.parse(postStudent));
    console.log(response);
    setPostResult(JSON.stringify(response.data));
  };

  return (
    <div className="App">
      <header>
        <a href="/"><img src={'./logo.svg'} /></a>
        <a href="/">Responsum</a>
      </header>
    </div>
  );
}

export default App;
