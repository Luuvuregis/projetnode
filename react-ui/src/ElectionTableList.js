import React from 'react';

class ElectionTableList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {results:[]};
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
                <th scope="row">{this.props.idElection}</th>
                <td>{this.props.nomElection}</td>
                <td>{date}</td>
                <td>{this.props.nameLocalisation}</td>
                <td>{this.props.tourElection}</td>
                <td>
                    <button type="button" class="close" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <button type="button" class="modifyIcon">
                        <i class="fas fa-pen"></i>
                    </button>
                </td>
            </tr>
        );
    }
}

export default ElectionTableList;