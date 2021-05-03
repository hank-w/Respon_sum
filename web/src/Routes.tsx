import { Route, Switch } from 'react-router-dom';
import Homepage from './components/pages/Homepage';
import StudentLoginPage from './components/pages/StudentLogin';
import StudentSignup from './components/pages/StudentSignup';
import StudentHomepage from './components/pages/StudentHomepage';
import StudentQuestionsStream from './components/pages/StudentQuestionsStream';
import InstructorLoginPage from './components/pages/instructors/InstructorLogin';
import InstructorSignupPage from './components/pages/instructors/InstructorSignup';
import InstructorHomepage from './components/pages/instructors/InstructorHomepage';
import ClassHomepage from './components/pages/classes/ClassHomepage';

import {
  BASE_PATH,
  STUDENTS_LOGIN_PATH,
  STUDENTS_SIGNUP_PATH,
  STUDENTS_PATH,
  STUDENTS_QUESTIONS_PATH,
  INSTRUCTORS_LOGIN_PATH,
  INSTRUCTORS_SIGNUP_PATH,
  INSTRUCTORS_PATH,
  CLASSES_PATH
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
    <Route exact path={INSTRUCTORS_LOGIN_PATH}>
      <InstructorLoginPage />
    </Route>
    <Route exact path={INSTRUCTORS_SIGNUP_PATH}>
      <InstructorSignupPage />
    </Route>
    <Route exact path={INSTRUCTORS_PATH}>
      <InstructorHomepage />
    </Route>
    <Route exact path={CLASSES_PATH}>
      <ClassHomepage />
    </Route>
  </Switch>
);
