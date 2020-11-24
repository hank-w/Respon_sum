import React, { Component } from 'react';
import '../Stylesheet/NewPerson.css';

class CreateGenre extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
          name :""
      },
      submitted: false,
      response: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {
    event.preventDefault();
    fetch('http://localhost:8080/genre', {
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

  handleChange(event) {
    this.setState({formData:{name :event.target.value}});
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Create a New Person</h1>
        </header>
        <br/><br/>
        <div className="formContainer">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
                <label>First Name</label>
                <input type="text" className="form-control" value={this.state.name} onChange={this.handleChange}/>
            </div>
                <button type="submit" className="btn btn-default">Submit</button>
          </form>
        </div>

        {this.state.submitted &&
          <div>
            <h2>
              New genre successfully added.
            </h2>
          </div>
        }

      </div>
    );
  }
}

export default CreateGenre;
