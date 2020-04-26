import React from 'react';

class ProcurationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {results: [], value: 0, alertProcurantClass: '', alertProcurantMessage: '', description: ''}
        this.handleChangeElection = this.handleChangeElection.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeElection(event) {
        this.setState({value: event.target.value});
    }

    handleDescription(event) {
        this.setState({description: event.target.value});
    }


    handleSubmit(event) {
        fetch('/addProcurant', {method: "POST", headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                procurant: {
                    idUser: localStorage.getItem("idUser"),
                    idElection: this.state.value,
                    descriptionProcurant: this.state.description,
                }
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.message);
            this.setState({alertProcurantMessage: data.message})
            if(data.success) {
                this.setState({alertProcurantClass: 'alert alert-success'})
            }
            else {
                this.setState({alertProcurantClass: 'alert alert-danger'})
            }
        });
        event.preventDefault();
    }


    componentDidMount() {
        if(localStorage.getItem("idLocalisation") !== 0){
            fetch('/getElectionsByLocalisation', {method: "POST", headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    election: {
                        idUser: localStorage.getItem("idUser"),
                        idLocalisation : localStorage.getItem("idLocalisation"),
                    }
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if(data.length > 0) {
                    this.setState({value: data[0].idElection})
                }
                this.setState({results:data});
            });
        }
    }

    render() {
        const electionDispo = this.state.results.map((ligne) => 
            <option value={ligne.idElection}>{ligne.nameLocalisation + ' - ' + ligne.nomElection + ' - ' + 
            new Date(ligne.dateElection).getFullYear() + '-0' +
            parseInt(new Date(ligne.dateElection).getMonth() + 1) + '-' 
            + new Date(ligne.dateElection).getDate() +
            ' - Tour ' + ligne.tourElection}</option>)
        const selectElectionDispo = <select onChange={this.handleChangeElection} class="form-control form-control-lg">{electionDispo}</select>

        return(
            <div class="modal fade" id={this.props.modalId} tabindex="-1" role="dialog" aria-labelledby="SettingsModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLongTitle">{this.props.nameForm}</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  </div>
  
                  <div class="modal-body">
                    <form onSubmit={this.handleSubmit}>
                        <div class="form-group">
                                <label for="SelectLocalisation">Election concernée : {selectElectionDispo}</label>
                        </div>

                        <div class="form-group">
                            <label for="exampleFormControlTextarea1">Description (Optionnelle)</label>
                            <textarea class="form-control" id="ProcurantDescription" value={this.state.description} onChange={this.handleDescription} rows="3"></textarea>
                        </div>

                        <div class="form-group">
                            <span role="alert" class={this.state.alertProcurantClass}>{this.state.alertProcurantMessage}</span>
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

export default ProcurationForm;