import React from 'react'

class MaVisionForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visions : [{"idVision":0, "nomVision":'Choisissez une vision politique'}], idVision1: 0, idVision2: 0,
            alertVisionClass: '', alertVisionMessage: ''
        };
        this.handleChangeVision1 = this.handleChangeVision1.bind(this);
        this.handleChangeVision2 = this.handleChangeVision2.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        fetch('/updateVisionUser', {method: "POST", headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                vision: {
                    idUser: localStorage.getItem("idUser"),
                    idVision1 : this.state.idVision1,
                    idVision2 : this.state.idVision2
                }
            })
        })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if(data.success) {
            this.setState({alertVisionClass:"alert alert-success"});
            localStorage.setItem("idVision1", this.state.idVision1);
            localStorage.setItem("idVision2", this.state.idVision2);
          }
          else this.setState({alertVisionClass:"alert alert-danger"});
          this.setState({alertVisionMessage: data.message})
        });
        event.preventDefault();
    }

    handleChangeVision1(event) {
        this.setState({idVision1: event.target.value}); 
    }

    handleChangeVision2(event) {
        this.setState({idVision2: event.target.value}); 
    }

    componentDidMount() {
        if(localStorage.getItem("idUser") != null) {
            fetch('http://localhost:5000/getAllVisions')
            .then(res => res.json())
            .then(data => {
                var joined = this.state.visions.concat(data);
                this.setState({visions: joined});
                console.log(data);
            });
        }
    }

    render() {
        const visions = this.state.visions.map((vision) => <option value={vision.idVision}>{vision.nomVision}</option>)
        const selectVisions1 = <select onChange={this.handleChangeVision1} class="form-control form-control-lg">{visions}</select>
        const selectVisions2 = <select onChange={this.handleChangeVision2} class="form-control form-control-lg">{visions}</select>

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
                            <label for="SelectVision1">Choisissez votre première vision politique : {selectVisions1}</label>
                        </div>

                        <div class="form-group">
                            <label for="SelectVision1">Choisissez votre deuxième vision politique : {selectVisions2}</label>
                        </div>

                        <div class="form-group">
                            <span role="alert" class={this.state.alertVisionClass}>{this.state.alertVisionMessage}</span>
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

export default MaVisionForm;