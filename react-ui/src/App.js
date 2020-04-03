import React, { useState } from 'react';
import RegisterForm from './RegisterForm';
import SettingsForm from './SettingsForm'
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {results: [], isConnected: false, name: '', pwd: '', 
                alertMessage: '', alertClass: '',
                inputNameType:'text', inputPwdType:"password", inputSubmitType:'submit'};
                
    this.handleLoginChangeName = this.handleLoginChangeName.bind(this);
    this.handleLoginChangePwd = this.handleLoginChangePwd.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this)
  }

  handleLoginChangeName(event) {    this.setState({name: event.target.value});  }
  handleLoginChangePwd(event) {    this.setState({pwd: event.target.value});  }
  handleLoginConnect = (event) => {
    fetch("/login", {method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            user: {
                name: this.state.name,
                pwd: this.state.pwd
            }
        })
    })
    .then(res => res.json())
    .then(data => {
        if(!data.success) {
            this.setState({alertClass: "alert alert-danger"});
        }
        else {
          this.setState({alertClass: "alert alert-success"});
          this.setState({inputNameType: "hidden"});
          this.setState({inputPwdType: "hidden"});
          this.setState({inputSubmitType: "hidden"});
          localStorage.setItem("isConnected", true);
          localStorage.setItem("nameUser", data.nameUser);
          localStorage.setItem("idUser", data.idUser);
          console.log("loaded data :" + data.idUser);
        }
        this.setState({alertMessage: data.message})
        this.setState({isConnected: data.success});
    });
    event.preventDefault();
  }
  handleDisconnect(event) { 
    localStorage.clear();
    this.setState({isConnected: false});
    this.setState({inputNameType: "text"});
    this.setState({inputPwdType: "password"});
    this.setState({inputSubmitType: "submit"});
    this.setState({alertMessage: ""});
    this.setState({alertClass: ""});
  }


  componentDidMount() {
    fetch('http://localhost:5000/')
      .then(res => res.json())
      .then(data => {this.setState({results: data});console.log(data)});
      console.log()
  }

  render() {
    let connectLink, registrationLink, profilLinks, searchBar;

    return (
      <div>
        <ul class="nav justify-content-center bg-dark">
          <li class="nav-item custom-nav"><a className="nav-item nav-link customNavLink" href="#">Home <span className="sr-only">(current)</span></a></li>
          <li class="nav-item custom-nav"><a className="nav-item nav-link customNavLink" href="#">About</a></li>

          {(!this.state.isConnected && !localStorage.getItem("isConnected")) && 
            <li class="nav-item custom-nav"><a className="nav-item nav-link customNavLink" href="#" data-toggle="modal" data-target="#registrationFormId">Register</a></li> &&
            <li class="nav-item custom-nav"><a className="nav-item nav-link customNavLink" href="#" data-toggle="modal" data-target="#LoginFormId">Login</a></li>
          }
          {(this.state.isConnected && localStorage.getItem("isConnected")) && 
            <li class="nav-item dropdown custom-nav">
              <a class="nav-link dropdown-toggle customNavLink" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Profile</a>
              <div class="dropdown-menu">
                <a class="dropdown-item" href="#"  data-toggle="modal" data-target="#settingsFormId">Settings</a>
                <div class="dropdown-divider"></div>
                <a className="nav-item nav-link dropdown-item" onClick={this.handleDisconnect} href="#">Logout</a>
              </div>
            </li>
          }
          
        </ul>

        <RegisterForm />
        <SettingsForm idUser={localStorage.getItem("idUser")} nameUser={localStorage.getItem("nameUser")} />
        
        <div class="modal fade" show={this.state.showModal} id="LoginFormId" tabindex="-1" role="dialog" aria-labelledby="LoginModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="LoginModalCenterTitle">Login</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              </div>
              <form onSubmit={this.handleLoginConnect}>

                <div class="modal-body">
                  <div class="form-group">
                    <input type={this.state.inputNameType}  class="form-control form-control-lg" value={this.state.name} placeholder="What's your pseudo ?" onChange={this.handleLoginChangeName} />
                  </div>

                  <div class="form-group">
                    <input type={this.state.inputPwdType}  class="form-control form-control-lg" value={this.state.pwd} placeholder="Gimme your password" onChange={this.handleLoginChangePwd} />
                  </div>

                  <div class="form-group">
                    <div class={this.state.alertClass} role="alert">{this.state.alertMessage}</div>
                  </div>
                </div>

                <div class="modal-footer">
                  <div class="form-group">
                    <input type={this.state.inputSubmitType} class="btn btn-primary" value="Submit"/>
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

}

export default App;
