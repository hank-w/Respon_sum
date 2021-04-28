import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { HomepageWrapper, MainButton, MainButtonContainer } from '../style/Homepage';
import { STUDENTS_LOGIN_PATH, INSTRUCTORS_LOGIN_PATH } from '../../utils/Paths';

export default () => {
  return (
    <HomepageWrapper>
      <MainButtonContainer>
        <Link to={STUDENTS_LOGIN_PATH} style={{ width: '100%' }}>
          <Button type="primary" size="large" block>
            Students
          </Button>
        </Link>
        <Link to={INSTRUCTORS_LOGIN_PATH} style={{ width: '100%'}}> 
        <Button type="primary" size="large" block>
          Instructors
        </Button>
        </Link>
        <Button type="primary" size="large" block>
          Classes  
        </Button>
      </MainButtonContainer>
    </HomepageWrapper>
  );
};
