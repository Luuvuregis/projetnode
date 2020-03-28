import React from 'react';

class LoginForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {name: '', pwd: '', alertMessage: '', alertClass: ''};
      this.handleChangeName = this.handleChangeName.bind(this);
      this.handleChangePwd = this.handleChangePwd.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChangeName(event) {    this.setState({name: event.target.value});  }
    handleChangePwd(event) {    this.setState({pwd: event.target.value});  }
    handleSubmit(event) {
        alert('Le nom a été soumis : ' + this.state.name);
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
          //this.setState({alertMessage: data.message});
          console.log(data);
        });
        event.preventDefault();
    }
  
    render() {
      return (
        <div class="modal fade" id="LoginFormId" tabindex="-1" role="dialog" aria-labelledby="LoginModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="LoginModalCenterTitle">Login</h5>
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
                        </div>

                        <div class="modal-footer">
                        <div class="form-group">
                            <span class={this.state.alertClass} role="alert">{this.state.alertMessage}</span>
                        </div>
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

  export default LoginForm;