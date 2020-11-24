import React, { Component } from 'react';
import '../Stylesheet/NewPerson.css';

class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        name: "",
        email: "",
        password: "",
        repassword:"",
        user_name:"",
        admin:false,
      },
      submitted: false,
    }
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleRePasswordChange = this.handleRePasswordChange.bind(this);
    this.handleUserNameChange = this.handleUserNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {
    event.preventDefault();
    if(this.state.formData.password !== this.state.formData.repassword)
    {
        window.alert("Passwords do not match retry");
        return;
    }
    if(this.state.formData.name==="" || this.state.formData.password==="" || this.state.formData.user_name==="")
    {
        window.alert("Please fill the form completely");
        return;
    }
    fetch('http://localhost:8080/user', {
     method: 'POST',
     body: JSON.stringify(this.state.formData),
   })
      .then(response => {
        if(response.status >= 200 && response.status < 300)
          this.setState({submitted: true});
        else {
            window.alert("Cannot be added try another handle");
        }
      });
  }

  handleNameChange(event) {
      let tempVar = {...this.state.formData};
      tempVar.name = event.target.value;
      this.setState({formData:tempVar})
  }
  handleEmailChange(event) {
      let tempVar = {...this.state.formData};
      tempVar.email = event.target.value;
      this.setState({formData:tempVar})
  }
  handlePasswordChange(event) {
      let tempVar = {...this.state.formData};
      tempVar.password = event.target.value;
      this.setState({formData:tempVar})
  }
  handleRePasswordChange(event) {
      let tempVar = {...this.state.formData};
      tempVar.repassword = event.target.value;
      this.setState({formData:tempVar})
  }
  handleUserNameChange(event) {
      let tempVar = {...this.state.formData};
      tempVar.user_name = event.target.value;
      this.setState({formData:tempVar})
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Sign Up</h1>
        </header>
        <br/><br/>
        <div className="formContainer">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
                <label>Name</label>
                <input type="text" className="form-control" value={this.state.name} onChange={this.handleNameChange}/>
            </div>
            <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" value={this.state.email} onChange={this.handleEmailChange}/>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" value={this.state.password} onChange={this.handlePasswordChange}/>
            </div>
            <div className="form-group">
                <label>Re enter Password</label>
                <input type="password" className="form-control" value={this.state.repassword} onChange={this.handleRePasswordChange}/>
            </div>
            <div className="form-group">
                <label>User Handle (try to be unique)</label>
                <input type="text" className="form-control" value={this.state.user_name} onChange={this.handleUserNameChange}/>
            </div>
                <button type="submit" className="btn btn-default">Submit</button>
          </form>
        </div>

        {this.state.submitted &&
          <div>
            <h2>
              New person successfully added.
            </h2>
          </div>
        }

      </div>
    );
  }
}

export default SignUp;
