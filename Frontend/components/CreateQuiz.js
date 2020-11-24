import React, { Component } from 'react';
import '../Stylesheet/NewPerson.css';

class CreateQuiz extends Component {
  constructor(params) {
    super();
    this.state = {
      formData: {
          title :"",
          genre_id : parseInt(params.match.params.genre_id,10),
      },
      submitted: false,
      response: []
    }
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {
    event.preventDefault();
    fetch(`http://localhost:8080/quiz`, {
     method: 'POST',
     body: JSON.stringify(this.state.formData),
   })
      .then(response => {
        if(response.status >= 200 && response.status < 300)
          {
              this.setState({submitted: true});
          }
      });
  }

  handleTitleChange(event) {
    let tempVar = {...this.state.formData};
    tempVar.title = event.target.value;
    this.setState({formData:tempVar})
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Create a New Quiz</h1>
        </header>
        <br/><br/>
        <div className="formContainer">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
                <label>Title for quiz</label>
                <input type="text" className="form-control" value={this.state.title} onChange={this.handleTitleChange}/>
            </div>
                <button type="submit" className="btn btn-default">Submit</button>
          </form>
        </div>

        {this.state.submitted &&
          <div>
            <h2>
              New quiz successfully added.
            </h2>
          </div>
        }

      </div>
    );
  }
}

export default CreateQuiz;
