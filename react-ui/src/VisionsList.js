import React from 'react';
import VisionItem from './VisionItem';

class VisionsList extends React.Component {
    constructor(props){
        super(props);
        this.state = {results: []};
    }

    componentDidMount(){
        fetch('http://localhost:5000/getAllVisions')
        .then(res => res.json())
        .then(data => {
            this.setState({results:data})
        });
    }

    render(){
        const listItems = this.state.results.map((ligne) => 
        <VisionItem key={ligne.idVision.toString()}  idVision={ligne.idVision} nomVision={ligne.nomVision} />
        );
        return(
            <div class="modal fade" id={this.props.modalId} tabindex="-1" role="dialog" aria-labelledby="ElectionsModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">{this.props.nameForm}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        </div>
        
                        <div class="modal-body">
                            <ul>
                                {listItems}
                            </ul>
                        </div>
        
                        <div class="modal-footer"></div>
        
                    </div>
                </div>
            </div>
        );
    }
}

export default VisionsList;