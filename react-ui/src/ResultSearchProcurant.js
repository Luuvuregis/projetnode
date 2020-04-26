import React from 'react'

class ResultSearchProcurant extends React.Component{
    constructor(props){
        super(props);
        this.state = {phone: this.props.procurantInfos.phoneUser}
        this.handleContact = this.handleContact.bind(this);
    }

    handleContact(event) {
        alert(this.state.phone);
        event.preventDefault();
    }


    render() {
        return(
            <tr>
                <th scope="row">{this.props.procurantInfos.firstnameUser}</th>
                <td>{this.props.procurantInfos.descriptionProcurant}</td>
                <td>{this.props.procurantInfos.nomVision1}</td>
                <td>{this.props.procurantInfos.nomVision2}</td>
                <td>{this.props.procurantInfos.nameLocalisation}</td>
                <td>                    
                    <button type="button" class="modifyIcon"  onClick={this.handleContact}>
                        <i class="fas fa-phone"></i>
                    </button></td>
            </tr>


        );
    }
}

export default ResultSearchProcurant;