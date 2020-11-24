import React, { Component } from 'react';
import '../Stylesheet/DeletePerson.css';

class DeleteQuiz extends Component {
    constructor(params) {
      super();
      this.state = {
        data: [],
        submitted : false,
        genre_id : parseInt(params.match.params.genre_id,10),
        quiz_id:0,
      }
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleCheck = this.handleCheck.bind(this);
    }

// Lifecycle hook, runs after component has mounted onto the DOM structure
componentDidMount() {
  const request = new Request(`http://127.0.0.1:8080/quizes/${this.state.genre_id}`);
  fetch(request)
    .then(response => response.json())
      .then(data => this.setState({data: data}));
}


//When a radio button is checked
handleCheck(event){
    this.setState({quiz_id : event.target.value});
}

//Handle task of communicating with backend for deletion
  handleSubmit (event) {
  event.preventDefault();
  fetch(`http://localhost:8080/quiz/${this.state.quiz_id}`, {
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
                </tr>
              </thead>
              <tbody>{this.state.data.map(function(item, key) {
                   return (
                  <tr key = {key}>
                      <td><input type="radio" name="toBeDeleted" value={item.id} onChange={this.handleCheck}/></td>
                      <td>{item.title}</td>
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

export default DeleteQuiz;
