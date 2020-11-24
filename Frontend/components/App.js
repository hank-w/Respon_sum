import React, { Component } from 'react';
import DeletePerson from './DeletePerson';
import ViewPeople from './ViewPeople';
import EditPerson from './EditPerson';
import SignUp from './SignUp';
import SignIn from './SignIn';
import SignOut from './SignOut';
import Home from './Home';

import ViewGenre from './ViewGenre';
import GlobalLeaderBoard from './GlobalLeaderBoard'
import UserHome from './UserHome'
import GenreHome from './GenreHome'
import CreateGenre from './CreateGenre'
import DeleteGenre from './DeleteGenre'
import QuizHome from './QuizHome'
import CreateQuiz from './CreateQuiz'
import DeleteQuiz from './DeleteQuiz'
import CreateQuestion from './CreateQuestion';
import DeleteQuestion from './DeleteQuestion';
import QuestionHome from './QuestionHome';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class App extends Component {
    constructor(props) {
    super(props);
    this.localStorageIsAdmin= this.localStorageIsAdmin.bind(this);
    this.localStorageIsLoggedIn = this.localStorageIsLoggedIn.bind(this);
    this.localStorageGiveUserId = this.localStorageGiveUserId.bind(this);
}
localStorageIsAdmin(){
    let Auth = JSON.parse(localStorage["auther"]);
    return Auth.admin
}
localStorageIsLoggedIn(){
    let Auth = JSON.parse(localStorage["auther"]);
    return Auth.logged_in
}
localStorageGiveUserId(){
    let Auth = JSON.parse(localStorage["auther"]);
    return Auth.user_id
}
  render() {
    return (
      <div>
        <Router>
          <div>
            <nav className="navbar navbar-default">
              <div className="container-fluid">
                <div className="navbar-header">
                  <Link className="navbar-brand" to={'/'}>React App</Link>
                </div>
                <ul className="nav navbar-nav">
                  <li><Link to={'/'}>Home</Link></li>
                  {this.localStorageIsLoggedIn() && <li><Link to={`/UserHome/${this.localStorageGiveUserId()}`}>Dashboard</Link></li>}
                  {!this.localStorageIsLoggedIn() && <li><Link to={'/SignIn'}>SignIn</Link></li>}
                  {!this.localStorageIsLoggedIn() && <li><Link to={'/SignUp'}>SignUp</Link></li>}
                  {this.localStorageIsAdmin() && <li><Link to={'/EditPerson'}>Edit Person</Link></li>}
                  {this.localStorageIsAdmin() && <li><Link to={'/DeletePerson'}>Delete Person</Link></li>}
                  {this.localStorageIsAdmin() && <li><Link to={'/ViewPeople'}>View People</Link></li>}
                  <li><Link to={'/ViewGenre'}>View Genre</Link></li>
                  <li><Link to={'/GlobalLeaderBoard'}>LeaderBoard</Link></li>
                  {this.localStorageIsLoggedIn() && <li><Link to={'/SignOut'}>SignOut</Link></li>}
                </ul>
              </div>
            </nav>
            <Switch>
                 <Route exact path='/' component={Home} />
                 {!this.localStorageIsLoggedIn() && <Route exact path='/SignIn' component={SignIn} />}
                 {!this.localStorageIsLoggedIn() && <Route exact path='/SignUp' component={SignUp} />}
                 {this.localStorageIsLoggedIn() && <Route exact path='/SignOut' component={SignOut} />}
                 <Route exact path='/EditPerson' component={EditPerson} />
                 <Route exact path='/DeletePerson' component={DeletePerson} />
                 <Route exact path='/ViewPeople' component={ViewPeople} />
                 <Route exact path='/ViewGenre' component={ViewGenre} />
                 <Route exact path='/GlobalLeaderBoard' component={GlobalLeaderBoard} />
                 {this.localStorageIsLoggedIn() && <Route exact path='/UserHome/:user_id' component={UserHome}/>}
                 <Route exact path='/GenreHome/:genre_id' component={GenreHome}/>
                 <Route path='/question/:genre_id/:quiz_id' component={QuizHome}/>
                 <Route exact path='/QuestionHome/:genre_id/:quiz_id/:question_id' component={QuestionHome} />
                 {this.localStorageIsAdmin() && <Route exact path='/CreateQuestion/:quiz_id' component={CreateQuestion}/>}
                 {this.localStorageIsAdmin() && <Route exact path='/DeleteQuestion/:quiz_id' component={DeleteQuestion}/>}
                 {this.localStorageIsAdmin() && <Route exact path='/CreateQuiz/:genre_id' component={CreateQuiz}/>}
                 {this.localStorageIsAdmin() && <Route exact path='/DeleteQuiz/:genre_id' component={DeleteQuiz}/>}
                 {this.localStorageIsAdmin() && <Route exact path='/CreateGenre' component={CreateGenre}/>}
                 {this.localStorageIsAdmin() && <Route exact path='/DeleteGenre' component={DeleteGenre}/>}
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
