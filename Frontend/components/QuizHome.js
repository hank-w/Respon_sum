import React, { Component } from 'react';
import '../Stylesheet/ViewGenre.css';
import { Link } from 'react-router-dom';


class QuizHome extends Component{
  constructor(params) {
    super();
    this.state = {
      identity:[],
      genre_id:params.match.params.genre_id,
      quiz_id:params.match.params.quiz_id,
      questions:[],
      globalQuestionIndex:0
    }
    this.localStorageIsAdmin= this.localStorageIsAdmin.bind(this);
    this.localStorageIsLoggedIn = this.localStorageIsLoggedIn.bind(this);
    this.localStorageGiveUserId = this.localStorageGiveUserId.bind(this);
    this.makeHTMLTag = this.makeHTMLTag.bind(this);
    this.makeOneHTMLTag = this.makeOneHTMLTag.bind(this);
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
    const request = new Request(`http://127.0.0.1:8080/quiz/${this.state.quiz_id}`);
    fetch(request)
      .then(response => response.json())
        .then(identity => this.setState({identity: identity}));
    const request2 = new Request(`http://127.0.0.1:8080/questions/${this.state.quiz_id}`);
    fetch(request2)
      .then(response => response.json())
        .then(questions => this.setState({questions: questions}));
  }
  makeHTMLTag(arr){
       var innerHTML = []
      for(let i=0;i < arr.length;i++){
          innerHTML.push(this.makeOneHTMLTag(arr[i],i));
      }
      return (<ul className="nav navbar-nav">{innerHTML}</ul>)
  }
  makeOneHTMLTag(element,key){
      let tag = <li key={`${key}`}><Link to={`/QuestionHome/${this.state.genre_id}/${this.state.quiz_id}/${element.id}`}>{`${element.question}`}</Link></li>;
      return tag
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">List of all questions</h1>
        </header>
            <div>
              <nav className="navbar navbar-default">
                <div className="container-fluid">
                  <div className="navbar-header">
                    <Link className="navbar-brand" to={'/'}>React App</Link>
                  </div>
                   {
                       this.makeHTMLTag(this.state.questions)
                   }
                   <ul className="nav navbar-nav">
                   {this.localStorageIsAdmin() && <li><Link to={`/CreateQuestion/${this.state.quiz_id}`}>CreateQuestion</Link></li>}
                   {this.localStorageIsAdmin() && <li><Link to={`/DeleteQuestion/${this.state.quiz_id}`}>DeleteQuestion</Link></li> }
                   </ul>
                </div>
              </nav>
            </div>
      </div>
    );
  }
}

export default QuizHome;
