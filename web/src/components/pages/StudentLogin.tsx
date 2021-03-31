import { useState } from 'react';
import { Button } from 'antd';
import { StudentLoginWrapper, StudentLoginParent } from '../style/StudentLogin';

export default () => {
  const [uuid, setUUID] = useState<string>();

  return (
    <StudentLoginParent>
      <StudentLoginWrapper>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <label>uuid:</label>
          <input type="text" id="uuid" name="uuidLogin" value={uuid} onChange={e => setUUID(e.target.value)} />
        </div>
        <Button type="primary" size="large" block>
          Login
        </Button>
        <Button size="large" block>
          Signup
        </Button>
      </StudentLoginWrapper>
    </StudentLoginParent>
  );
};
