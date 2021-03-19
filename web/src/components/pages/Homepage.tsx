import { Link } from 'react-router-dom';
import { HomepageWrapper, MainButton, MainButtonContainer } from '../style/Homepage';
import { STUDENTS_LOGIN_PATH } from '../../utils/Paths';

export default () => {
  return (
    <HomepageWrapper>
      <MainButtonContainer>
        <Link to={STUDENTS_LOGIN_PATH}>
          <MainButton>
            Students
          </MainButton>
        </Link>
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
