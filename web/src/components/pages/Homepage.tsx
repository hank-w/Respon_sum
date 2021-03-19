import { HomepageWrapper, MainButton, MainButtonContainer } from '../style/Homepage';

export default () => {
  return (
    <HomepageWrapper>
      <MainButtonContainer>
        <MainButton>
          Students
        </MainButton>
        <MainButton>
          Instructors
        </MainButton>
        <MainButton>
          Classes  
        </MainButton>
      </MainButtonContainer>
    </HomepageWrapper>
  );
};
