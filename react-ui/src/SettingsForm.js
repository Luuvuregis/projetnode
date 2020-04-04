import React from 'react';

class SettingsForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {localisations : [{"idLocalisation":0, "nameLocalisation":'Choose a localisation'}]}
    }

    componentDidMount() {
      fetch('http://localhost:5000/getAllLocalisations')
      .then(res => res.json())
      .then(data => {
        var joined = this.state.localisations.concat(data);
        this.setState({localisations: joined});console.log(this.state.localisations)});
    }

    render() {
      if(this.state.localisations[0] == null) {
        return(<div>rien</div>);
      }
      else {
        const localisations = this.state.localisations.map((localisation) => <option value={localisation.idLocalisation}>{localisation.nameLocalisation}</option>)

        return(
        <div class="modal fade" id="settingsFormId" tabindex="-1" role="dialog" aria-labelledby="SettingsModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">Settings</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <form>

                <div class="modal-body">
                  <div class="form-group">
                    <label for="InputPseudo"> Your pseudo : <input type="text" class="form-control form-control-lg" placeholder={this.props.nameUser} readOnly/></label>
                  </div>

                  <div class="form-group">
                    <label for="InputEmail"> Your email : <input type="text" class="form-control form-control-lg" placeholder={this.props.emailUser}/></label>
                  </div>

                  <div class="form-group">
                    <label for="SelectLocalisation"> Your localisation : <select class="form-control form-control-lg" name="localisations">{localisations}</select></label>
                  </div>

                  <div class="form-group">
                    <label for="InputPassword"> Gimme your new password : <input type="password" class="form-control form-control-lg"/></label>
                  </div>

                  <div class="form-group">
                    <label for="InputPassword2"> Gimme your new password again : <input type="password" class="form-control form-control-lg"/></label>
                  </div>
                </div>

                <div class="modal-footer">
                  <div class="form-group">
                    <span role="alert"></span>
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
}

export default SettingsForm;