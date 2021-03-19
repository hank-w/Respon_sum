import { Route, Switch } from 'react-router-dom';
import Homepage from './components/pages/Homepage';
import StudentLoginPage from './components/pages/StudentLogin';
import {
  BASE_PATH,
  STUDENTS_LOGIN_PATH,
} from './utils/Paths';

export default () => (
  <Switch>
    <Route exact path={BASE_PATH}>
      <Homepage />
    </Route>
    <Route exact path={STUDENTS_LOGIN_PATH}>
      <StudentLoginPage />
    </Route>
  </Switch>
);
