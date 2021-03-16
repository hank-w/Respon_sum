import { Route } from 'react-router-dom';
import Homepage from './components/pages/Homepage';
import {
  BASE_PATH,
} from './utils/Paths';

export default () => (
  <>
    <Route exact path={BASE_PATH}>
      <Homepage />
    </Route>
  </>
);
