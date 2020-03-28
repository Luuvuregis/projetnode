import React from 'react';
import NavBar from './NavBar';
import RegisterForm from './RegisterForm';
import './App.css';
import LoginForm from './LoginForm';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {results: []};
  }

  componentDidMount() {
    fetch('http://localhost:5000/')
      .then(res => res.json())
      .then(data => {this.setState({results: data});console.log(data)});
  }

  render() {
    return (
      <div>
        <NavBar />
        <RegisterForm />
        <LoginForm />
      </div>
    );
  };

}

export default App;
