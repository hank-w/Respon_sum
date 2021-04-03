import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { StudentLoginWrapper, StudentLoginParent } from '../style/StudentLogin';
import { STUDENTS_PATH } from '../../utils/Paths';
import { connectUUID, UUIDContextType } from '../../Contexts';

const StudentLogin = ({uuid, setUUID}: UUIDContextType) => {
  return (
    <StudentLoginParent>
      <StudentLoginWrapper>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <label>uuid:</label>
          <input type="text" id="uuid" name="uuidLogin" value={uuid} onChange={e => setUUID(e.target.value)} />
        </div>
        <Link to={STUDENTS_PATH} style={{ width:'100%' }}>
          <Button type="primary" size="large" block>
            Login
          </Button>
        </Link>
        <Button size="large" block>
          Signup
        </Button>
      </StudentLoginWrapper>
    </StudentLoginParent>
  );
};

export default connectUUID(StudentLogin);
