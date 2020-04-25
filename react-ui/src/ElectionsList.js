import React from 'react';
import ElectionTableList from './ElectionTableList'

class ElectionsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {results:[]};
    }


    componentDidMount() {
        fetch('http://localhost:5000/getAllElections')
            .then(res => res.json())
            .then(data => {
                this.setState({results: data});
                console.log(data);
            });
    }

    render() {
        const lignes = this.state.results.map((ligne) => 
            <ElectionTableList idElection={ligne.idElection} nomElection={ligne.nomElection} dateElection={ligne.dateElection}
                idLocalisation={ligne.idLocalisation} tourElection={ligne.tourElection} nameLocalisation={ligne.nameLocalisation}/>) 

        return(
            <div class="modal fade" id={this.props.modalId} tabindex="-1" role="dialog" aria-labelledby="ElectionsListModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLongTitle">{this.props.nameForm}</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  </div>
  
                  <div class="modal-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">id de l'election</th>
                                <th scope="col">Nom de l'election</th>
                                <th scope="col">Date de l'election</th>
                                <th scope="col">Localisation</th>
                                <th scope="col">Tour de l'élection</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lignes}
                        </tbody>
                    </table>
                  </div>
  
                  <div class="modal-footer"></div>
  
              </div>
            </div>
          </div>
        );
    }
}

export default ElectionsList;