import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from 'antd';
import { StudentLoginWrapper, StudentLoginParent } from '../style/StudentLogin';
import { STUDENTS_PATH, STUDENTS_SIGNUP_PATH } from '../../utils/Paths';
import { getStudentById } from '../../api/students';
import { setStudent } from '../../utils/Actions';

const StudentLogin = () => {
  const [uuid, setUUID] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const history = useHistory();

  const onLoginPressed = () => {
    setLoading(true);
    getStudentById(uuid)
    .then(res => {
      dispatch(setStudent(res.data));
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

  const onSignupPressed = () => {
    history.push(STUDENTS_SIGNUP_PATH);
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
        <Button size="large" block onClick={onSignupPressed}>
          Signup
        </Button>
        <span style={{color:'red'}}>{error}</span>
      </StudentLoginWrapper>
    </StudentLoginParent>
  );
};

export default StudentLogin;
