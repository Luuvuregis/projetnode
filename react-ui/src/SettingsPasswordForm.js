import React from 'react';

class SettingsPasswordForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pwd: '', confirmPwd: '', alertPasswordClass: '', alertPasswordMessage: '' }
        this.handleSettingsChangePwd = this.handleSettingsChangePwd.bind(this);
        this.handleSettingsChangeConfirm = this.handleSettingsChangeConfirm.bind(this)
        this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
    }


    //PASSWORDS CHANGES
    handleSettingsChangePwd(event) {  this.setState({pwd: event.target.value}) };
    handleSettingsChangeConfirm(event) {  this.setState({confirmPwd: event.target.value}) };
    handlePasswordSubmit(event) {
      fetch("/changePasswordUser", {method: "PUT", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          user: {
            id: this.props.idUser,
            pwd: this.state.pwd,
            confirmPwd: this.state.confirmPwd
          }
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({alertPasswordMessage: data.message});
        if(data.success)  this.setState({alertPasswordClass: "alert alert-success"});
        else              this.setState({alertPasswordClass: "alert alert-danger"});
      });
      event.preventDefault();
    }

    render() {
        return(
            <div class="card">
                <div class="card-header" id="headingTwo">
                    <h5 class="mb-0">
                        <button class="btn btn-link" data-toggle="collapse" data-target={this.props.hrefPassword} aria-expanded="true" aria-controls={this.props.collapsePassword}>
                            Change your password
                        </button>
                    </h5>
                </div>

                <div class="collapse" id={this.props.collapsePassword} aria-labelledby="headingTwo" data-parent="#accordion">
                    <div class="card-body">

                        <form onSubmit={this.handlePasswordSubmit}>
                            <div class="form-group">
                                <label for="InputPassword"> Votre mot de passe : <input type="password" class="form-control form-control-lg" value={this.state.pwd} onChange={this.handleSettingsChangePwd} /></label>
                            </div>

                            <div class="form-group">
                                <label for="InputPassword2"> Confirmez votre mot de passe : <input type="password" class="form-control form-control-lg" value={this.state.confirmPwd} onChange={this.handleSettingsChangeConfirm}/></label>
                            </div>

                            <div class="form-group">
                                <span role="alert" class={this.state.alertPasswordClass}>{this.state.alertPasswordMessage}</span>
                            </div>

                            <div class="form-group">
                                <input type="submit" class="btn btn-primary" value="Submit" />
                            </div>
                            
                        </form>
                    </div>
                </div>
            </div>

        );
    }

}


export default SettingsPasswordForm;