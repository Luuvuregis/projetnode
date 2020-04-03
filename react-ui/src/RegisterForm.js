import React from 'react';

class RegisterForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {name: '', pwd: '', confirmPwd: '', email: '', alertMessage: '', alertClass: ''};
      this.handleRegisterChangeEmail = this.handleRegisterChangeEmail.bind(this);
      this.handleRegisterChangeName = this.handleRegisterChangeName.bind(this);
      this.handleRegisterChangePwd = this.handleRegisterChangePwd.bind(this);
      this.handleChangeConfirm = this.handleChangeConfirm.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleRegisterChangeEmail(event) {  this.setState({email: event.target.value}) };
    handleRegisterChangeName(event) {    this.setState({name: event.target.value});  }
    handleRegisterChangePwd(event) {    this.setState({pwd: event.target.value});  }
    handleChangeConfirm(event) {    this.setState({confirmPwd: event.target.value});  }
    handleSubmit(event) {
      alert('Le nom a été soumis : ' + this.state.name);
      fetch("/register", {method: "POST", headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              user: {
                  name: this.state.name,
                  pwd: this.state.pwd,
                  confirmPwd: this.state.confirmPwd,
                  email: this.state.email
              }
          })
      })
      .then(res => res.json())
      .then(data => {
          console.log(data.message)
          this.setState({alertMessage: data.message});
          if(data.success)  this.setState({alertClass: "alert alert-success"});
          else              this.setState({alertClass: "alert alert-danger"});
        });
      event.preventDefault();
    }
  
    render() {
      return (
        <div class="modal fade" id="registrationFormId" tabindex="-1" role="dialog" aria-labelledby="RegistrationModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Registration</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              </div>
              <form onSubmit={this.handleSubmit}>

                <div class="modal-body">
                  <div class="form-group">
                    <label for="InputEmail"> What's your email : <input type="text" class="form-control form-control-lg" value={this.state.email} onChange={this.handleRegisterChangeEmail} /></label>
                  </div>

                  <div class="form-group">
                    <label for="InputPseudo"> What's your pseudo : <input type="text" class="form-control form-control-lg" value={this.state.name} onChange={this.handleRegisterChangeName} /></label>
                  </div>

                  <div class="form-group">
                    <label for="InputPassword"> Gimme your password : <input type="password" class="form-control form-control-lg" value={this.state.pwd} onChange={this.handleRegisterChangePwd} /></label>
                  </div>

                  <div class="form-group">
                    <label for="InputPassword2"> Gimme your password again : <input type="password" class="form-control form-control-lg" value={this.state.confirmPwd} onChange={this.handleChangeConfirm} /></label>
                  </div>
                </div>

                <div class="modal-footer">
                  <div class="form-group">
                    <div class={this.state.alertClass} role="alert">{this.state.alertMessage}</div>
                  </div>
                  <br/>
                  <div class="form-group">
                    <input type="submit" class="btn btn-primary" value="Submit" />
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      );
    }
  }

  export default RegisterForm;