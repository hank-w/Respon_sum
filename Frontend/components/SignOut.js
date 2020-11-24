import React, { Component } from 'react';
import '../Stylesheet/NewPerson.css';
import { Redirect } from 'react-router';

class SignOut extends Component {
    constructor() {
        super();
        this.state = {
            auth : {
                id : null,
                logged_in : false,
                admin : false,
                user_name : "",
            },
           }

    this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit () {
        localStorage.setItem("auther",JSON.stringify(this.state.auth));
        window.location.reload()
    }

  render() {
    return(
        <div>
        {this.handleSubmit()}
        <Redirect to="/"/>
        </div>
    )
  }
}

export default SignOut;
