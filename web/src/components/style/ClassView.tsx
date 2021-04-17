import styled from 'styled-components';

export const ClassViewWrapper = styled.div`
  width: 100%;
  margin: 20px;
  padding: 20px;
  border-radius: 15px;
  border-style: solid;
  border-width: 3px;
  border-color: ${({ active }: { active: boolean }) => active ? 'rgb(0, 135, 249)' : '#DDD'};
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const ClassInformation = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin-left: 15px;
`;