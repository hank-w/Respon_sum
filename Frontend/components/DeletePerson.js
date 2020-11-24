import React, { Component } from 'react';
import '../Stylesheet/DeletePerson.css';

class DeletePerson extends Component {
    constructor() {
      super();
      this.state = {
        data: [],
        submitted : false,
        id:"",
      }
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleCheck = this.handleCheck.bind(this);
    }

// Lifecycle hook, runs after component has mounted onto the DOM structure
componentDidMount() {
  const request = new Request('http://127.0.0.1:8080/user/');
  fetch(request)
    .then(response => response.json())
      .then(data => this.setState({data: data}));
}


//When a radio button is checked
handleCheck(event){
    this.setState({id : event.target.value});
}

//Handle task of communicating with backend for deletion
  handleSubmit (event) {
  fetch('http://localhost:8080/user/'+this.state.id, {
   method: 'DELETE',
 })
    .then(response => {
      if(response.status >= 200 && response.status < 300)
        this.setState({submitted: true});
    });
    //this.componentDidMount()    don't know why not required
    //Don't know why this line works
    this.render();
}

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Delete a Person</h1>
        </header>
            <form onSubmit={this.handleSubmit}>
            <table className="table-hover">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>User Handle</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>{this.state.data.map(function(item, key) {
                   return (
                  <tr key = {key}>
                      <td><input type="radio" name="toBeDeleted" value={item.id} onChange={this.handleCheck}/></td>
                      <td>{item.user_name}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
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

export default DeletePerson;
