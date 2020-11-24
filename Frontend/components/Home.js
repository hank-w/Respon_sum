import React, { Component } from 'react';
import NewComponent from './NewComponent';
import '../Stylesheet/Home.css'

class Home extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Go-2-React-Quiz-Portal</h1>
        </header>
        <NewComponent text={"Made By Prajwal Krishna Maitin against battling hard deadlines"}/>
      </div>
    );
  }
}

export default Home;
