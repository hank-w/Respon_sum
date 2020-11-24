import React, { Component } from 'react';
import '../Stylesheet/DeletePerson.css';

class DeleteQuestion extends Component {
    constructor(params) {
      super();
      this.state = {
        data: [],
        submitted : false,
        quiz_id : parseInt(params.match.params.quiz_id,10),
        question_id:0,
      }
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleCheck = this.handleCheck.bind(this);
    }

// Lifecycle hook, runs after component has mounted onto the DOM structure
componentDidMount() {
  const request = new Request(`http://127.0.0.1:8080/questions/${this.state.quiz_id}`);
  fetch(request)
    .then(response => response.json())
      .then(data => this.setState({data: data}));
}


//When a radio button is checked
handleCheck(event){
    this.setState({question_id : event.target.value});
}

//Handle task of communicating with backend for deletion
  handleSubmit (event) {
  event.preventDefault();
  fetch(`http://localhost:8080/question/${this.state.question_id}`, {
   method: 'DELETE',
 })
    .then(response => {
      if(response.status >= 200 && response.status < 300)
        this.setState({submitted: true});
    });
}

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Delete a Quiz</h1>
        </header>
            <form onSubmit={this.handleSubmit}>
            <table className="table-hover">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Quiz Name</th>
                  <th>Type</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>{this.state.data.map(function(item, key) {
                   return (
                  <tr key = {key}>
                      <td><input type="radio" name="toBeDeleted" value={item.id} onChange={this.handleCheck}/></td>
                      <td>{item.question}</td>
                      <td>{item.multi?"Multi Correct":"Single Correct"}</td>
                      <td>{item.score}</td>
                  </tr>
                    )
                },this)}
              </tbody>
           </table>
           <br/>
           <button type="submit" className="btn btn-default">Delete</button>
           </form>
      </div>
    );
  }
}

export default DeleteQuestion;
