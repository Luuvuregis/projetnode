import React from 'react';
import ElectionsForm from './ElectionsForm';

class ElectionTableList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {results:[], modalId: '', idElection: this.props.idElection, electionsForm: ''};
        this.handleDeleteLine = this.handleDeleteLine.bind(this);
        this.handleModifyLine = this.handleModifyLine.bind(this);
    }

    handleModifyLine(event) {
        this.setState({electionsForm: ''})
        console.log(this.state.idElection);
        this.setState({electionsForm :
            <ElectionsForm idElection={this.state.idElection}  method={"PUT"} 
                        nameForm={this.state.idElection} modalId={"electionUpdateFormId"} idUser={localStorage.getItem("idUser")}/>})
    }

    handleDeleteLine(event) {
        fetch('/deleteElection', {method: "DELETE", headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                election: {
                    idElection: this.props.idElection
                }
            })
        })
        .then(res => res.json())
        .then(data => {
          console.log(data);
        });
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

    render() {
        var date = this.formatDate(this.props.dateElection)
        return(
            <tr>
                <th scope="row">{this.state.idElection}</th>
                <td>{this.props.nomElection}</td>
                <td>{date}</td>
                <td>{this.props.nameLocalisation}</td>
                <td>{this.props.tourElection}</td>
                <td>
                    <button type="button" class="close" aria-label="Close" onClick={this.handleDeleteLine}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <button type="button" class="modifyIcon" data-toggle="modal" onClick={this.handleModifyLine} data-target="#electionUpdateFormId">
                        <i class="fas fa-pen"></i>
                    </button>

                    {this.state.electionsForm}
                </td>
            </tr>
        );
    }
}

export default ElectionTableList;