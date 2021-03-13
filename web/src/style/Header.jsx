import styled from 'styled-components'; 
import logo from '../logo.svg';

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 10px;
`;

export const Logo = styled.img.attrs({src: logo})`
  width: 100px;
  height: 100px;
`;

export const Title = styled.h1`
  border-radius: 30px;
  border: none;
`;
