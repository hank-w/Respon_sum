import { useState } from 'react';
import './App.css';
import { Student, ID } from './types/api';
import { getStudentId, createStudent } from './api/students';
import { Link, BrowserRouter } from 'react-router-dom';

import { Header } from './components/Header';

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
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
}

export default App;
