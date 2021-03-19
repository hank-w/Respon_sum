import styled from 'styled-components';

export const StudentLoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 300px;
`;

export const LoginButton = styled.button`
  color: black;
  font-size: 1.2em;
  text-align: center;
  background-color: #ECE;
  padding: 10px;
  width: 120%;
  border-radius: 6px;
`;

export const SignupButton = styled(LoginButton)`
  background-color: #CEC;
`;
