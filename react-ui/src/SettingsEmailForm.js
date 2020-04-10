import React from 'react';

class SettingsEmailForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { email: '', alertEmailClass:'', alertEmailMessage: ''}
        this.handleSettingsChangeEmail = this.handleSettingsChangeEmail.bind(this);
        this.handleEmailSubmit = this.handleEmailSubmit.bind(this);
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

    render() {
        return(
          <div class="card">
            <div class="card-header" id="headingOne">
              <h5 class="mb-0">
              <button class="btn btn-link" data-toggle="collapse" data-target={this.props.hrefEmail} aria-expanded="true" aria-controls={this.props.collapseEmail}>
                Change your email
              </button>
              </h5>
            </div>

            <div class="collapse" id={this.props.collapseEmail} aria-labelledby="headingOne" data-parent="#accordion">
              <div class="card-body">
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
            </div>
          </div>
        );
    }
}


export default SettingsEmailForm;