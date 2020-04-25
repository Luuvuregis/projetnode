import React from 'react';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class ElectionsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {nameElection: '', idLocalisation: 0, startDate: new Date(), tourElection: 1, alertElectionClass: '', alertElectionMessage: '',
            localisations : [{"idLocalisation":0, "nameLocalisation":'National'}]
        };
        this.handleChangeNameElection = this.handleChangeNameElection.bind(this);
        this.handleChangeLocalisation = this.handleChangeLocalisation.bind(this);
        this.handleChangeTourElection = this.handleChangeTourElection.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeDate = date => {
        this.setState({
          startDate: date
        });
      };

    handleChangeLocalisation(event) {
        this.setState({idLocalisation: event.target.value}); 
    }

    handleChangeTourElection(event) {
        this.setState({tourElection: event.target.value}); 
    }

    handleChangeNameElection(event) {
        this.setState({nameElection: event.target.value}); 
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }

    handleSubmit(event) {
        var dateFormat = this.formatDate(this.state.startDate);
        var localBody; var serverLink;
        if(this.props.method == "POST") {
            alert("POST")
            serverLink = '/addElection';
            localBody = JSON.stringify({
                election: {
                    nomElection: this.state.nameElection,
                    tourElection: this.state.tourElection,
                    idLocalisation: this.state.idLocalisation,
                    dateElection: dateFormat
                }
            });
        }
        else {
            alert("PUT");
            serverLink = '/updateElection';
            localBody = JSON.stringify({
                election: {
                    idElection: this.props.idElection,
                    nomElection: this.state.nameElection,
                    tourElection: this.state.tourElection,
                    idLocalisation: this.state.idLocalisation,
                    dateElection: dateFormat
                }
            });
        }

        fetch(serverLink, {method: this.props.method, headers: {'Content-Type': 'application/json'},
            body: localBody
        })
        .then(res => res.json())
        .then(data => {
        console.log(data);
        if(data.success){
            this.setState({alertElectionClass: "alert alert-success"});
        }
        else {
            this.setState({alertElectionClass: "alert alert-danger"});
        }

        this.setState({alertElectionMessage: data.message});
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
            });
        }
    }

    render() {
        const localisations = this.state.localisations.map((localisation) => <option value={localisation.idLocalisation}>{localisation.nameLocalisation}</option>)
        const selectLocalisations = <select onChange={this.handleChangeLocalisation} class="form-control form-control-lg">{localisations}</select>
        const elections = ['Municipales', 'Departementales', 'Regionales', 'Legislatives', 'Presidentielle', 'Communale', 'Referendum'].map((election) => <option value={election}>{election}</option>)
        const selectElections = <select onChange={this.handleChangeNameElection} class="form-control form-control-lg">{elections}</select>

        const tourElection = [1, 2, 3].map((election) => <option value={election}>{election}</option>)
        const selectTourElections = <select onChange={this.handleChangeTourElection} class="form-control form-control-lg">{tourElection}</select>
        

        return(
            <div class="modal fade" id={this.props.modalId} tabindex="1" role="dialog" aria-labelledby="ElectionsModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLongTitle">{this.props.nameForm}</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  </div>
  
                  <div class="modal-body">
                    <form onSubmit={this.handleSubmit}>

                        <div class="form-group">
                            <label for="SelectElection">Choisissez le type d'élection : {selectElections}</label>
                        </div>

                        <div class="form-group">
                            <label for="SelectElection">Indiquez le tour de l'élection : {selectTourElections}</label>
                        </div>

                        <div class="form-group">
                            <label for="SelectLocalisation">Choisissez la localisation : {selectLocalisations}</label>
                        </div>

                        <div class="form-group">
                            <label for="SelectDate">Précisez la date : <br/>
                                <DatePicker selected={this.state.startDate} onChange={this.handleChangeDate} dateFormat="yyyy-MM-dd"/>
                            </label>
                        </div>

                        <div class="form-group">
                            <span role="alert" class={this.state.alertElectionClass}>{this.state.alertElectionMessage}</span>
                        </div>

                        <br/>

                        <div class="form-group">
                            <input type="submit" class="btn btn-primary" value="Ajouter" />
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

export default ElectionsForm;