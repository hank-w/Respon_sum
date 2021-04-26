import { Route, Switch } from 'react-router-dom';
import Homepage from './components/pages/Homepage';
import StudentLoginPage from './components/pages/StudentLogin';
import StudentSignup from './components/pages/StudentSignup';
import StudentHomepage from './components/pages/StudentHomepage';
import StudentQuestionsStream from './components/pages/StudentQuestionsStream';
import {
  BASE_PATH,
  STUDENTS_LOGIN_PATH,
  STUDENTS_SIGNUP_PATH,
  STUDENTS_PATH,
  STUDENTS_QUESTIONS_PATH,
} from './utils/Paths';

export default () => (
  <Switch>
    <Route exact path={BASE_PATH}>
      <Homepage />
    </Route>
    <Route exact path={STUDENTS_LOGIN_PATH}>
      <StudentLoginPage />
    </Route>
    <Route exact path={STUDENTS_SIGNUP_PATH}>
      <StudentSignup />
    </Route>
    <Route exact path={STUDENTS_PATH}>
      <StudentHomepage />
    </Route>
    <Route exact path={STUDENTS_QUESTIONS_PATH}>
      <StudentQuestionsStream />
    </Route>
  </Switch>
);
