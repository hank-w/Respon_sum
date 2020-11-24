import React, { Component } from 'react';
import '../Stylesheet/ViewPeople.css';

class GlobalLeaderBoard extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      count:0
    }
  }

  // Lifecycle hook, runs after component has mounted onto the DOM structure
  componentDidMount() {
    const request = new Request('http://127.0.0.1:8080/leaderboard/');
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({data: data}));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Hall of Fame</h1>
        </header>

        <table className="table-hover">
          <thead>
            <tr>
              <th>Rank</th>
              <th>ID</th>
              <th>User Name</th>
              <th>Total Score</th>
            </tr>
          </thead>
          <tbody>{this.state.data.map(function(item, key) {
               return (
                  <tr key = {key}>
                      <td>{key+1}</td>
                      <td>{item.id}</td>
                      <td>{item.user_name}</td>
                      <td>{item.total}</td>
                  </tr>
                )
            })}
          </tbody>
       </table>
      </div>
    );
  }
}

export default GlobalLeaderBoard;
