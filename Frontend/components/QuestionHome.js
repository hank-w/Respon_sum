import React, { Component } from 'react';
import '../Stylesheet/ViewGenre.css';
import { Redirect } from 'react-router-dom';


class QuestionHome extends Component{
  constructor(props) {
    super(props);
    this.state = {
      question:[],
      quiz_id:props.match.params.quiz_id,
      user_id:this.localStorageGiveUserId(),
      question_id:props.match.params.question_id,
      quizes:[],
      rankList:[],
      formData:{
          radioValue:'',
          checkBox:{a:false,b:false,c:false,d:false}
      },
      editData:{
          quiz_id:'',
          user_id:'',
          score:0
      },
      submitted: false,
      response: []
    }
    this.handleRadioCheck = this.handleRadioCheck.bind(this);
    this.handleBoxCheck = this.handleBoxCheck.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.localStorageIsAdmin= this.localStorageIsAdmin.bind(this);
    this.localStorageIsLoggedIn = this.localStorageIsLoggedIn.bind(this);
    this.localStorageGiveUserId = this.localStorageGiveUserId.bind(this);
  }

  //When a radio button is checked
  handleRadioCheck(event){
      let tempVar = {...this.state.formData};
      tempVar.radioValue = event.target.value;
      this.setState({formData:tempVar})
  }
  //When a checkbox is checked
  handleBoxCheck(event){
      let tempVar = {...this.state.formData};
      tempVar.checkBox[event.target.value] = !tempVar.checkBox[event.target.value];
      this.setState({formData:tempVar})
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
    const request = new Request(`http://127.0.0.1:8080/question/${this.state.question_id}`);
    fetch(request)
      .then(response => response.json())
        .then(question => this.setState({question: question}));
    const request2 = new Request(`http://127.0.0.1:8080/leaderboardDisplay/${this.localStorageGiveUserId()}/${this.state.quiz_id}`);
    fetch(request2)
      .then(response => response.json())
        .then(editData => this.setState({editData: editData}));
  }
  handleSubmit (event) {
      let checkAnswer = true;
      if(this.state.question.multi){
          for (let i in ['a','b','c','d']){
            if(this.state.formData.checkbox[i]!=(this.state.question.answer.indexOf(i)!=-1)){
                checkAnswer = false;}
            }
      }
      else{
          checkAnswer = (this.state.question.answer==this.state.formData.radioValue);
      }
      event.preventDefault();
      if(checkAnswer){
         let tempVar = {...this.state.editData};
         tempVar.score += this.state.question.score;
         this.setState({editData:tempVar})
         event.preventDefault();
         fetch(`http://localhost:8080/leaderboard/${this.state.editData.id}`, {
         method: 'PUT',
         body: JSON.stringify(tempVar),
         }).then(response => {
               if(response.status >= 200 && response.status < 300){
                  this.setState({submitted: true});
                  window.alert("Correct")
              }
         });
      }
      else{
          this.setState({submitted: true});
          window.alert("Wrong Answer");
      }
 }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">List of all quizes</h1>
        </header>
        {console.log(this.state.formData)}
        <h3>{this.state.question.question}</h3>
        <form onSubmit={this.handleSubmit}>
           {this.state.question.multi &&
             <div>
             <ul>
                 <li><input type="checkbox" name="options" value="a" onChange={this.handleBoxCheck}/>&nbsp;{this.state.question.option_a}</li>
                 <li><input type="checkbox" name="options" value="b" onChange={this.handleBoxCheck}/>&nbsp;{this.state.question.option_b}</li>
                 <li><input type="checkbox" name="options" value="c" onChange={this.handleBoxCheck}/>&nbsp;{this.state.question.option_c}</li>
                 <li><input type="checkbox" name="options" value="d" onChange={this.handleBoxCheck}/>&nbsp;{this.state.question.option_d}</li>
             </ul>
             </div>
           }
           {!this.state.question.multi &&
             <div>
                <ul>
                    <li><input type="radio" name="options" value="a" onChange={this.handleRadioCheck}/>&nbsp;{this.state.question.option_a}</li>
                    <li><input type="radio" name="options" value="b" onChange={this.handleRadioCheck}/>&nbsp;{this.state.question.option_b}</li>
                    <li><input type="radio" name="options" value="c" onChange={this.handleRadioCheck}/>&nbsp;{this.state.question.option_c}</li>
                    <li><input type="radio" name="options" value="d" onChange={this.handleRadioCheck}/>&nbsp;{this.state.question.option_d}</li>
                </ul>
             </div>
           }
           <button type="submit" className="btn btn-default">Submit</button>
           { this.state.submitted &&
               < Redirect to={this.params.hardLink}/>
           }
        </form>
      </div>
    );
  }
}

export default QuestionHome;
