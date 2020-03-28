import React from 'react';

class RegisterForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {name: '', pwd: '', confirmPwd: '', alertMessage: '', alertClass: ''};
      this.handleChangeName = this.handleChangeName.bind(this);
      this.handleChangePwd = this.handleChangePwd.bind(this);
      this.handleChangeConfirm = this.handleChangeConfirm.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChangeName(event) {    this.setState({name: event.target.value});  }
    handleChangePwd(event) {    this.setState({pwd: event.target.value});  }
    handleChangeConfirm(event) {    this.setState({confirmPwd: event.target.value});  }
    handleSubmit(event) {
      alert('Le nom a été soumis : ' + this.state.name);
      fetch("/register", {method: "POST", headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              user: {
                  name: this.state.name,
                  pwd: this.state.pwd,
                  confirmPwd: this.state.confirmPwd
              }
          })
      })
      .then(res => res.json())
      .then(data => {
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
                    <label for="InputPseudo"> What's your pseudo : <input type="text" class="form-control form-control-lg" value={this.state.name} onChange={this.handleChangeName} /></label>
                  </div>

                  <div class="form-group">
                    <label for="InputPassword"> Gimme your password : <input type="password" class="form-control form-control-lg" value={this.state.pwd} onChange={this.handleChangePwd} /></label>
                  </div>

                  <div class="form-group">
                    <label for="InputPassword2"> Gimme your password again : <input type="password" class="form-control form-control-lg" value={this.state.confirmPwd} onChange={this.handleChangeConfirm} /></label>
                  </div>
                </div>

                <div class="modal-footer">
                  <div class="form-group">
                    <span class={this.state.alertClass} role="alert">{this.state.alertMessage}</span>
                  </div>
                  <br/>
                  <div class="form-group">
                    <input type="submit" value="Envoyer" />
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