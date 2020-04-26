import React from 'react';

class IdentityForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {firstnameUser: '', lastnameUser: '', currentNameLocalisation: '', idLocalisation: this.props.idLocalisation, nameLocalisation: '',
            phoneUser: '',
            localisations : [{"idLocalisation":0, "nameLocalisation":'Choose a localisation'}],
            alertIdentityClass: '', alertIdentityMessage: ''
        };

        this.handleIdentityChangeFirstname = this.handleIdentityChangeFirstname.bind(this);
        this.handleIdentityChangeLastname = this.handleIdentityChangeLastname.bind(this);
        this.handleIdentitySubmit = this.handleIdentitySubmit.bind(this);
        this.handleChangeLocalisation = this.handleChangeLocalisation.bind(this);
        this.handleIdentityChangePhone = this.handleIdentityChangePhone.bind(this);
    }

    handleIdentityChangePhone(event) {this.setState({phoneUser: event.target.value})}
    handleIdentityChangeFirstname(event) {this.setState({firstnameUser: event.target.value})}
    handleIdentityChangeLastname(event) {this.setState({lastnameUser: event.target.value})}
    handleChangeLocalisation(event) {
        this.setState({idLocalisation: event.target.value}); 
    }
    handleIdentitySubmit(event) {
        fetch('/updateIdentity', {method: "PUT", headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                identity: {
                    idUser: this.props.idUser,
                    firstnameUser: this.state.firstnameUser,
                    lastnameUser: this.state.lastnameUser,
                    idLocalisation: this.state.idLocalisation,
                    phoneUser: this.state.phoneUser
                }
            })
        })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if(data.success) {
            this.setState({alertIdentityClass:"alert alert-success"});
            localStorage.setItem("firstnameUser", this.state.firstnameUser);
            localStorage.setItem("lastnameUser", this.state.lastnameUser);
            localStorage.setItem("idLocalisation", this.state.idLocalisation);
            localStorage.setItem("phoneUser", this.state.phoneUser);
            this.setState({currentNameLocalisation: this.state.localisations[this.state.idLocalisation].nameLocalisation});
          }
          else this.setState({alertIdentityClass:"alert alert-danger"});
          this.setState({alertIdentityMessage: data.message})
        });
        event.preventDefault();
    }

    componentDidMount() {
        if(localStorage.getItem("idUser") != null) {
            fetch('http://localhost:5000/getAllLocalisations')
            .then(res => res.json())
            .then(data => {
            var joined = this.state.localisations.concat(data);
            this.setState({localisations: joined});
            this.setState({currentNameLocalisation: this.state.localisations[this.state.idLocalisation].nameLocalisation});
            });
        }
    }

    render() {
        const localisations = this.state.localisations.map((localisation) => <option value={localisation.idLocalisation}>{localisation.nameLocalisation}</option>)
        const selectLocalisations = <select onChange={this.handleChangeLocalisation} class="form-control form-control-lg">{localisations}</select>

        return(
            <div class="modal fade" id={this.props.modalId} tabindex="-1" role="dialog" aria-labelledby="SettingsModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLongTitle">{this.props.nameForm}</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  </div>
  
                  <div class="modal-body">
                    <form onSubmit={this.handleIdentitySubmit}>
                        <div class="form-group">
                            <label for="InputPseudo"> Votre prénom : <input type="text" class="form-control form-control-lg" value={this.state.firstnameUser} placeholder={this.props.firstnameUser} onChange={this.handleIdentityChangeFirstname}/></label>
                        </div>

                        <div class="form-group">
                            <label for="InputEmail"> Votre nom de famille : <input type="text" value={this.state.lastnameUser} placeholder={this.props.lastnameUser} onChange={this.handleIdentityChangeLastname} class="form-control form-control-lg"/></label>
                        </div>

                        <div class="form-group">
                            <label for="InputPhone"> Votre téléphone : <input type="text" value={this.state.phoneUser} placeholder={this.props.phoneUser} onChange={this.handleIdentityChangePhone} class="form-control form-control-lg"/></label>
                        </div>

                        <p> Votre localisation actuelle</p>
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" placeholder={this.state.currentNameLocalisation} aria-label="Name Localisation" aria-describedby="button-addon2" readOnly/>
                            <div class="input-group-append">
                                <button class="btn btn-secondary" id="button-addon2" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">Changer</button>
                            </div>
                        </div>

                        <div class="collapse" id="collapseExample">
                            <div class="form-group">
                                <label for="SelectLocalisation">Choisissez votre localisation : {selectLocalisations}</label>
                            </div>
                        </div>

                        <div class="form-group">
                            <div role="alert" class={this.state.alertIdentityClass}>{this.state.alertIdentityMessage}</div>
                        </div>

                        <br/>

                        <div class="form-group">
                            <input type="submit" class="btn btn-primary" value="Enregistrer" />
                        </div>
                    </form>
                  </div>
  
                  <div class="modal-footer"></div>
  
              </div>
            </div>
          </div>
        );
    }
}


export default IdentityForm;