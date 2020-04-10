import React from 'react';
import SettingsEmailForm from './SettingsEmailForm';
import SettingsPasswordForm from './SettingsPasswordForm';

class SettingsForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {localisations : [{"idLocalisation":0, "nameLocalisation":'Choose a localisation'}],
          hrefPassword: "#collapsePassword", collapsePassword: "collapsePassword",
          hrefEmail: "#collapseEmail", collapseEmail: "collapseEmail"
        }
    }

    componentDidMount() {
      /*fetch('/getAllLocalisations')
      .then(res => res.json())
      .then(data => {
        var joined = this.state.localisations.concat(data);
        this.setState({localisations: joined});console.log(this.state.localisations)});*/
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
                  <div id="accordion">

                    <SettingsEmailForm idUser={this.props.idUser} nameUser={this.props.nameUser} emailUser={this.props.emailUser} hrefEmail={this.state.hrefEmail} collapseEmail={this.state.collapseEmail}/>
                    <SettingsPasswordForm idUser={this.props.idUser} hrefPassword={this.state.hrefPassword} collapsePassword={this.state.collapsePassword}/>

                  </div>
                </div>

                <div class="modal-footer"></div>

            </div>
          </div>
        </div>
          );
      }
    }
}

export default SettingsForm;