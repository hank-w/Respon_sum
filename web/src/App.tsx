import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Student, ID } from './types/api';
import { getStudentId, createStudent } from './api/students';

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
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload ayyyyy.
        </p>
        <input type="textarea" value={studentId} onChange={e => setStudentId(e.target.value)} />
        <button onClick={onButtonPress}>GET</button>
        <input type="textarea" disabled={true} value={JSON.stringify(student)} />
        <input type="textarea" value={postStudent} onChange={e => setPostStudent(e.target.value)} />
        <button onClick={onPostButtonPress}>POST</button>
        <input type="textarea" disabled={true} value={postResult} />
      </header>
    </div>
  );
}

export default App;
