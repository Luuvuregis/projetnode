import React from 'react';
import ResultSearchProcurant from './ResultSearchProcurant';

class FindProcurant extends React.Component {

    constructor(props) {
        super(props);
        this.state = {elections: [], value: 0, searches: []}
        this.handleChangeElection = this.handleChangeElection.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeElection(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        fetch('/getProcurants', {method: "POST", headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                procurant: {
                    idUser: localStorage.getItem("idUser"),
                    idElection: this.state.value,
                    idVision1: localStorage.getItem("idVision1"),
                    idVision2: localStorage.getItem("idVision2"),
                    idLocalisation : localStorage.getItem("idLocalisation"),
                }
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.infos.length > 0) {
                this.setState({searches: data.infos});
            }
            else {
                this.setState({searches: []});
            }
            console.log(data.infos);
        });
        event.preventDefault();
    }

    componentDidMount() {
        if(localStorage.getItem("idUser") !== null && localStorage.getItem("idLocalisation") !== 0)
        {
            fetch('http://localhost:5000/getElectionsByLocalisation', {method: "POST", headers: {'Content-Type': 'application/json'},
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
                    this.setState({value: data[0].idElection});
                }
                this.setState({elections:data});
            });
        }
    }

    render() {

        let searches;
        const electionDispo = this.state.elections.map((ligne) => 
            <option value={ligne.idElection}>{ligne.nameLocalisation + ' - ' + ligne.nomElection + ' - ' + 
            new Date(ligne.dateElection).getFullYear() + '-0' +
            parseInt(new Date(ligne.dateElection).getMonth() + 1) + '-' 
            + new Date(ligne.dateElection).getDate() +
            ' - Tour ' + ligne.tourElection}</option>)
        const selectElectionDispo = <select onChange={this.handleChangeElection} class="form-control form-control-lg">{electionDispo}</select>

        if(this.state.searches.length > 0) {
            searches = this.state.searches.map((ligne) => <ResultSearchProcurant procurantInfos={ligne}/>)
        }


        return(
            <div class="modal fade" id={this.props.modalId} tabindex="-1" role="dialog" aria-labelledby="FindProcurantModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">{this.props.nameForm}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        </div>

                            <div class="modal-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div class="form-group">
                                            <label for="selectElections">Sélectionnez l'élection désirée : {selectElectionDispo}</label>
                                    </div>

                                    <div class="form-group">
                                        <input type="submit" class="btn btn-primary" value="Rechercher" />
                                    </div>
                                </form>
                        </div>

                        {this.state.searches.length > 0 &&
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">Nom du procurant</th>
                                        <th scope="col">Description du procurant</th>
                                        <th scope="col">Première vision politique</th>
                                        <th scope="col">Seconde vision politique</th>
                                        <th scope="col">Localisation</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                    {searches}

                                </tbody>
                            </table>
                        }

                        <div class="modal-footer"></div>
        
                    </div>
                </div>
            </div>
        );
    }
}

export default FindProcurant;