import { useState } from 'react';
import { StudentLoginWrapper, LoginButton, SignupButton } from '../style/StudentLogin';

export default () => {
  const [uuid, setUUID] = useState<string>();

  return (
    <StudentLoginWrapper>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <label>uuid:</label>
        <input type="text" id="uuid" name="uuidLogin" value={uuid} onChange={e => setUUID(e.target.value)} />
      </div>
      <LoginButton>
        Login
      </LoginButton>
      <SignupButton>
        Signup
      </SignupButton>
    </StudentLoginWrapper>
  );
};
