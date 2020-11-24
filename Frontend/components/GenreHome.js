import React, { Component } from 'react';
import '../Stylesheet/ViewGenre.css';
import { Link } from 'react-router-dom';

class GenreHome extends Component{
  constructor(props) {
    super(props);
    this.state = {
      identity:[],
      genre_id:props.match.params.genre_id,
      user_id:5,
      quizes:[],
      rankList:[],
      ADMIN : true,
    }
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
  // Lifecycle hook, runs after component has mounted onto the DOM structure
  componentDidMount() {
    const request = new Request(`http://127.0.0.1:8080/genre/${this.state.genre_id}`);
    fetch(request)
      .then(response => response.json())
        .then(identity => this.setState({identity: identity}));
    const request2 = new Request(`http://127.0.0.1:8080/quizes/${this.state.genre_id}`);
    fetch(request2)
      .then(response => response.json())
        .then(quizes => this.setState({quizes: quizes}));
    const request3 = new Request(`http://127.0.0.1:8080/leaderboard/${this.state.genre_id}`);
    fetch(request3)
      .then(response => response.json())
        .then(rankList => this.setState({rankList: rankList}));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Score Board</h1>
        </header>
            <table className="table-hover">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User Name</th>
                  <th>user_id</th>
                  <th>Total Score</th>
                </tr>
              </thead>
              <tbody>{this.state.rankList.map(function(item, key) {
                   return (
                      <tr key = {key}>
                          <td>{key+1}</td>
                          <td>{item.user_name}</td>
                          <td>{item.id}</td>
                          <td>{item.total}</td>
                      </tr>
                    )
                })}
              </tbody>
           </table>
           {this.localStorageIsLoggedIn() &&
               <div className="App">
               <h1 className="App-title">List of Quizes</h1>
               </div>
           }
           {this.localStorageIsLoggedIn() &&
               <div>
                  <nav className="navbar navbar-default">
                    <div className="container-fluid">
                      <div className="navbar-header">
                        <Link className="navbar-brand" to={'/'}>React App</Link>
                      </div>
                      <ul className="nav navbar-nav">
                      {this.state.quizes.map(function(item, key) {
                           return (<li key = {key}><Link to={`/question/${this.state.genre_id}/${item.id}`}>{item.title}</Link></li>)
                       },this)}
                       {this.localStorageIsAdmin() && <li><Link to={`/CreateQuiz/${this.state.genre_id}`}>CreateQuiz</Link></li>}
                       {this.localStorageIsAdmin() && <li><Link to={`/DeleteQuiz/${this.state.genre_id}`}>DeleteQuiz</Link></li> }
                       </ul>
                    </div>
                  </nav>
            </div>
          }
      </div>
    );
  }
}

export default GenreHome;
