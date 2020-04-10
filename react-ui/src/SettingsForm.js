import React from 'react';

class SettingsForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {localisations : [{"idLocalisation":0, "nameLocalisation":'Choose a localisation'}], 
          email: '', alertEmailClass:'', alertEmailMessage: '',
          pwd: '', confirmPwd: '', alertPasswordClass: '', alertPasswordMessage: '' }
        this.handleSettingsChangeEmail = this.handleSettingsChangeEmail.bind(this);
        this.handleEmailSubmit = this.handleEmailSubmit.bind(this);
        this.handleSettingsChangePwd = this.handleSettingsChangePwd.bind(this);
        this.handleSettingsChangeConfirm = this.handleSettingsChangeConfirm.bind(this)
        this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
    }

    componentDidMount() {
      fetch('/getAllLocalisations')
      .then(res => res.json())
      .then(data => {
        var joined = this.state.localisations.concat(data);
        this.setState({localisations: joined});console.log(this.state.localisations)});
    }

    handleSettingsChangeEmail(event) {  this.setState({email: event.target.value}) };
    handleEmailSubmit(event) {
      alert('Un email a été soumis : ' + this.state.email);
      fetch("/changeEmailUser", {method: "PUT", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          user: {
            id: this.props.idUser,
            email: this.state.email
          }
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({alertEmailMessage: data.message});
        if(data.success)  this.setState({alertEmailClass: "alert alert-success"});
        else              this.setState({alertEmailClass: "alert alert-danger"});
      });
      event.preventDefault();
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

    //RENDER
    render() {
      if(this.state.localisations[0] == null) {
        return(<div>rien</div>);
      }
      else {
        //const localisations = this.state.localisations.map((localisation) => <option value={localisation.idLocalisation}>{localisation.nameLocalisation}</option>)

        return(
        <div class="modal fade" id={this.props.modalId} tabindex="-1" role="dialog" aria-labelledby="SettingsModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">{this.props.nameForm}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>

                <div class="modal-body">
                  <ul class="list-group">

                    <li class="list-group-item">
                      <a class="btn btn-primary" data-toggle="collapse" href="#collapseEmail" role="button" aria-expanded="false" aria-controls="collapseEmail">Change Email</a>
                      <div class="collapse" id="collapseEmail">
                        <form onSubmit={this.handleEmailSubmit}>
                          <div class="form-group">
                            <label for="InputPseudo"> Your pseudo : <input type="text" class="form-control form-control-lg" placeholder={this.props.nameUser} readOnly/></label>
                          </div>

                          <div class="form-group">
                            <label for="InputEmail"> Your email : <input type="text" value={this.state.email} onChange={this.handleSettingsChangeEmail} class="form-control form-control-lg" placeholder={this.props.emailUser}/></label>
                          </div>

                          <div class="form-group">
                            <span role="alert" class={this.state.alertEmailClass}>{this.state.alertEmailMessage}</span>
                          </div>

                          <div class="form-group">
                            <input type="submit" class="btn btn-primary" value="Submit" />
                          </div>
                        </form>
                      </div>
                    </li>

                    <li class="list-group-item">
                      <a class="btn btn-primary" data-toggle="collapse" href="#collapsePassword" role="button" aria-expanded="false" aria-controls="collapsePassword">Change Password</a>
                      <div class="collapse" id="collapsePassword">
                        <form onSubmit={this.handlePasswordSubmit}>
                          <div class="form-group">
                            <label for="InputPassword"> Gimme your password : <input type="password" class="form-control form-control-lg" value={this.state.pwd} onChange={this.handleSettingsChangePwd} /></label>
                          </div>

                          <div class="form-group">
                            <label for="InputPassword2"> Gimme your password again : <input type="password" class="form-control form-control-lg" value={this.state.confirmPwd} onChange={this.handleSettingsChangeConfirm}/></label>
                          </div>

                          <div class="form-group">
                            <span role="alert" class={this.state.alertPasswordClass}>{this.state.alertPasswordMessage}</span>
                          </div>

                          <div class="form-group">
                            <input type="submit" class="btn btn-primary" value="Submit" />
                          </div>
                        </form>
                      </div>
                    </li>

                  </ul>
                </div>

                <div class="modal-footer">
                 
                </div>

            </div>
          </div>
        </div>
          );
      }
    }
}

export default SettingsForm;