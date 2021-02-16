import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Student, ID } from './types/api';
import { getStudentId } from './api/students';

function App() {
  const [studentId, setStudentId] = useState<ID>('');
  const [student, setStudent] = useState<Student>();

  const onButtonPress = async () => {
    setStudent(await getStudentId(studentId));
  };

  return (
    <div className="App">
      <header className="App-header">
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <input type="textarea" value={studentId} onChange={e => setStudentId(e.target.value)} />
        <button onClick={onButtonPress} />
        <input type="textarea" disabled={true} value={JSON.stringify(student)} />
      </header>
    </div>
  );
}

export default App;
