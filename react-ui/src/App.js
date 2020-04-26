import React from 'react';
import UserForm from './UserForm';
import SettingsForm from './SettingsForm';
import IdentityForm from './IdentityForm';
import ElectionsForm from './ElectionsForm';
import VisionForm from './VisionForm';
import MaVisionForm from './MaVisionForm';
import ElectionsList from './ElectionsList';
import VisionsList from './VisionsList';
import ProcurationForm from './ProcurationForm'
import FindProcurant from './FindProcurant';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {results: [], name: '', pwd: '', 
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
          localStorage.setItem("nameUser", data.nameUser);
          localStorage.setItem("emailUser", data.emailUser);
          localStorage.setItem("idUser", data.idUser);
          localStorage.setItem("firstnameUser", data.firstnameUser);
          localStorage.setItem("lastnameUser", data.lastnameUser);
          localStorage.setItem("idLocalisation", data.idLocalisation);
          localStorage.setItem("isAdmin", data.isAdmin);
          localStorage.setItem("idVision1", data.idVision1);          
          localStorage.setItem("idVision2", data.idVision2);
          localStorage.setItem("phoneUser", data.phoneUser);
          var welcomeMessage = "Bonjour " + localStorage.getItem("firstnameUser") + ' ' + localStorage.getItem("lastnameUser").charAt(0) + ".";
          localStorage.setItem("welcomeMessage", welcomeMessage);
          //document.location.reload(true);
        }
        this.setState({alertMessage: data.message})
    });
    event.preventDefault();
  }
  handleDisconnect(event) { 
    localStorage.clear();
    this.setState({inputNameType: "text"});
    this.setState({inputPwdType: "password"});
    this.setState({inputSubmitType: "submit"});
    this.setState({alertMessage: ""});
    this.setState({alertClass: ""});
    this.setState({welcomeMessage: "Bonjour "})
    fetch("/disconnect")
      .then(res => res.json())
      .then(data => {console.log(data.message)});
  }


  componentDidMount() {
    fetch('http://localhost:5000/')
      .then(res => res.json())
      .then(data => {
        if(data.connected) {
          localStorage.setItem("nameUser", data.nameUser);
          localStorage.setItem("emailUser", data.emailUser);
          localStorage.setItem("idUser", data.idUser);

          localStorage.setItem("firstnameUser", data.firstnameUser);
          localStorage.setItem("lastnameUser", data.lastnameUser);
          localStorage.setItem("idLocalisation", data.idLocalisation);
          localStorage.setItem("isAdmin", data.isAdmin);
          
          localStorage.setItem("idVision1", data.idVision1);          
          localStorage.setItem("idVision2", data.idVision2);
          localStorage.setItem("phoneUser", data.phoneUser);
          console.log(data);
          var welcomeMessage = "Bonjour " + localStorage.getItem("firstnameUser") + ' ' + localStorage.getItem("lastnameUser").charAt(0) + ".";
          localStorage.setItem("welcomeMessage", welcomeMessage);
        }
        else {
          localStorage.setItem("welcomeMessage", "Bonjour");
        }
      });
  }

  render() {

    return (
      <div>
        <nav class="navbar navbar-expand-lg nnavbar-dark bg-dark">
          <button class="navbar-brand customNavLink" href="#">Hello !</button>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarText">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item custom-nav"><button className="nav-item nav-link customNavLink" href="#">Accueil <span className="sr-only">(current)</span></button></li>
              <li class="nav-item custom-nav"><button className="nav-item nav-link customNavLink" href="#">Informations</button></li>
              {localStorage.getItem("idLocalisation") != null && 
                <li class="nav-item dropdown custom-nav">
                <button class="nav-link dropdown-toggle customNavLink" data-toggle="dropdown" href="#" aria-haspopup="true" aria-expanded="false">Procurations</button>
                <div class="dropdown-menu">
                  <button className="dropdown-item" href="#" data-toggle="modal" data-target="#procurantFormId">Être Procurant</button>
                  <button className="dropdown-item" href="#" data-toggle="modal" data-target="#findProcurantId">Chercher un Procurant</button>
                </div>
              </li>}
              
              {localStorage.getItem("idUser") == null && <li class="nav-item custom-nav"><button className="nav-item nav-link customNavLink" href="#" data-toggle="modal" data-target="#registrationFormId">S'enregistrer</button></li>}
              {localStorage.getItem("idUser") == null && <li class="nav-item custom-nav"><button className="nav-item nav-link customNavLink" href="#" data-toggle="modal" data-target="#LoginFormId">Se connecter</button></li>}
              {localStorage.getItem("isAdmin") == 1 && 
                <li class="nav-item dropdown custom-nav">
                  <button class="nav-link dropdown-toggle customNavLink" data-toggle="dropdown" href="#" aria-haspopup="true" aria-expanded="false">Administration</button>
                  <div class="dropdown-menu">
                    <button className="dropdown-item" href="#" data-toggle="modal" data-target="#electionFormId">Ajouter une élection</button>
                    <button className="dropdown-item" href="#" data-toggle="modal" data-target="#visionFormId">Ajouter une vision politique</button>
                    <div class="dropdown-divider"></div>
                    <button className="dropdown-item" href="#" data-toggle="modal" data-target="#electionListId">Liste des élections</button>
                    <button className="dropdown-item" href="#" data-toggle="modal" data-target="#visionsListId">Liste des visions politiques</button>
                  </div>
                </li>}
              {localStorage.getItem("idUser") != null && 
                <li class="nav-item dropdown custom-nav">
                  <button class="nav-link dropdown-toggle customNavLink" data-toggle="dropdown" href="#" aria-haspopup="true" aria-expanded="false">Mon profil</button>
                  <div class="dropdown-menu">
                    <button class="dropdown-item" href="#"  data-toggle="modal" data-target="#identityFormId">Ma carte d'identité</button>
                    <button class="dropdown-item" href="#"  data-toggle="modal" data-target="#maVisionFormId">Ma vision politique</button>
                    <button class="dropdown-item" href="#"  data-toggle="modal" data-target="#settingsFormId">Paramètres</button>
                    <div class="dropdown-divider"></div>
                    <button className="nav-item nav-link dropdown-item" onClick={this.handleDisconnect} href="#">Se déconnecter</button>
                  </div>
                </li>}
            </ul>
            <span class="navbar-text customNavLink">{localStorage.getItem("welcomeMessage")}</span>
          </div>
        </nav>

        <span class="spanTitle">TROUVE TON PROCURANT</span> 

        <IdentityForm nameForm='Mon identité' modalId='identityFormId' idUser={localStorage.getItem("idUser")} 
           firstnameUser={localStorage.getItem("firstnameUser")}  lastnameUser={localStorage.getItem("lastnameUser")}  
           idLocalisation={localStorage.getItem("idLocalisation")} phoneUser={localStorage.getItem("phoneUser")}/>

        <ProcurationForm nameForm='Etre Procurant' modalId='procurantFormId' idLocalisation={localStorage.getItem("idLocalisation")}/>

        <UserForm nameForm='Inscription' modalId='registrationFormId'/>

        <SettingsForm nameForm='Paramètres' modalId='settingsFormId' nameUser={localStorage.getItem("nameUser")} 
            emailUser={localStorage.getItem("emailUser")} idUser={localStorage.getItem("idUser")}/>

        <ElectionsForm nameForm='Ajouter une élection' modalId='electionFormId' idUser={localStorage.getItem("idUser")} method={"POST"}/>

        <ElectionsList nameForm='Liste des prochaines élections' modalId='electionListId' idUser={localStorage.getItem("idUser")}/>
        <VisionsList nameForm='Liste des visions politiques disponibles' modalId='visionsListId' idUser={localStorage.getItem("idUser")}/>

        <VisionForm nameForm='Ajouter une vision politique' modalId='visionFormId' idUser={localStorage.getItem("idUser")} method={"POST"}/>

        
        <MaVisionForm nameForm='Ma vision politique' modalId='maVisionFormId' idUser={localStorage.getItem("idUser")}/>

        <FindProcurant nameForm='Trouver un procurant' modalId='findProcurantId' idUser={localStorage.getItem("idUser")}/>
        
        <div class="modal fade" show={this.state.showModal} id="LoginFormId" tabindex="-1" role="dialog" aria-labelledby="LoginModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="LoginModalCenterTitle">Se connecter</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              </div>
              <form onSubmit={this.handleLoginConnect}>

                <div class="modal-body">
                  <div class="form-group">
                    <input type={this.state.inputNameType}  class="form-control form-control-lg" value={this.state.name} placeholder="Votre email" onChange={this.handleLoginChangeName} />
                  </div>

                  <div class="form-group">
                    <input type={this.state.inputPwdType}  class="form-control form-control-lg" value={this.state.pwd} placeholder="Votre mot de passe" onChange={this.handleLoginChangePwd} />
                  </div>

                  <div class="form-group">
                    <div class={this.state.alertClass} role="alert">{this.state.alertMessage}</div>
                  </div>
                </div>

                <div class="modal-footer">
                  <div class="form-group">
                    <input type={this.state.inputSubmitType} class="btn btn-primary" value="Se connecter"/>
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
