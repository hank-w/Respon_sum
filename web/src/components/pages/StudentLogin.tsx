import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';
import { StudentLoginWrapper, StudentLoginParent } from '../style/StudentLogin';
import { STUDENTS_PATH } from '../../utils/Paths';
import { connectStudent, StudentContextType } from '../../Contexts';
import { getStudentById } from '../../api/students';

const StudentLogin = ({student, setStudent}: StudentContextType) => {
  const [uuid, setUUID] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  const onLoginPressed = () => {
    setLoading(true);
    getStudentById(uuid)
    .then(res => {
      console.log(res);
      setStudent(res.body);
      setError(null);
      history.push(STUDENTS_PATH);
    })
    .catch(err => {
      console.log(err);
      setError(err?.message+'' || err?.msg+'' || err+'');
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <StudentLoginParent>
      <StudentLoginWrapper>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <label>uuid:</label>
          <input type="text" id="uuid" name="uuidLogin" value={uuid} onChange={e => setUUID(e.target.value)} />
        </div>
        <Button type="primary" size="large" block onClick={onLoginPressed} loading={loading}>
          Login
        </Button>
        <Button size="large" block>
          Signup
        </Button>
        <span style={{color:'red'}}>{error}</span>
      </StudentLoginWrapper>
    </StudentLoginParent>
  );
};

export default connectStudent(StudentLogin);
