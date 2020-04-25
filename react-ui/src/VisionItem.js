import React from 'react';
import VisionForm from './VisionForm';

class VisionItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visionForm: ''}
        this.handleDeleteLine = this.handleDeleteLine.bind(this);
        this.handleModifyLine = this.handleModifyLine.bind(this);
    }

    handleModifyLine(event) {
        this.setState({visionForm: ''})
        this.setState({visionForm: <VisionForm modalId={"visionUpdateFormId"} nameForm={this.props.nomVision} method={"PUT"}
            idVision={this.props.idVision} nomVision={this.props.nomVision} idUser={localStorage.getItem("idUser")}/>})
    }

    handleDeleteLine(event){
        fetch('/deleteVision', {method: "DELETE", headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                vision: {
                    idVision: this.props.idVision
                }
            })
        })
        .then(res => res.json())
        .then(data => {
          console.log(data);
        });
    }

    render() {
        return(
            <li>
                {this.props.nomVision} - 

                <button type="button" class="modifyIcon" onClick={this.handleDeleteLine}>
                    <i class="fas fa-times"></i>
                </button>

                <button type="button" class="modifyIcon" onClick={this.handleModifyLine} data-toggle="modal" data-target="#visionUpdateFormId">
                    <i class="fas fa-pen"></i>
                </button>

                {this.state.visionForm}
            </li>
        );
    }
}

export default VisionItem;