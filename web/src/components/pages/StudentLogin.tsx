import { StudentLoginWrapper, LoginButton, SignupButton } from '../style/StudentLogin';

export default () => {
  return (
    <StudentLoginWrapper>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <label>uuid:</label>
        <input type="text" id="uuid" name="uuidLogin" />
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
