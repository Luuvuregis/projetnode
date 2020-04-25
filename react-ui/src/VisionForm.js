import React from 'react';

class VisionForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {nameVision: '', alertVisionClass: '', alertVisionMessage: ''};
        this.handleChangeNameVision = this.handleChangeNameVision.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeNameVision(event) {
        this.setState({nameVision: event.target.value}); 
    }


    handleSubmit(event) {
        if(this.props.method == "POST") {
            fetch('/addVision', {method: "POST", headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    vision: {
                        nomVision: this.state.nameVision
                    }
                })
            })
            .then(res => res.json())
            .then(data => {
            console.log(data);
                if(data.success){
                    this.setState({alertVisionClass: "alert alert-success"});
                }
                else {
                    this.setState({alertVisionClass: "alert alert-danger"});
                }

                this.setState({alertVisionMessage: data.message});
            });
            event.preventDefault();
        }
        else {
            fetch('/updateVision', {method: "PUT", headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    vision: {
                        idVision: this.props.idVision,
                        nomVision: this.state.nameVision
                    }
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if(data.success){
                    this.setState({alertVisionClass: "alert alert-success"});
                }
                else {
                    this.setState({alertVisionClass: "alert alert-danger"});
                }

                this.setState({alertVisionMessage: data.message});
            });
            event.preventDefault();
        }
    }

    render() {        
        return(
            <div class="modal fade" id={this.props.modalId} tabindex="-1" role="dialog" aria-labelledby="ElectionsModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLongTitle">{this.props.nameForm}</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  </div>
  
                  <div class="modal-body">
                    <form onSubmit={this.handleSubmit}>

                        <div class="form-group">
                            <label for="InputVision"> Nom de la vision politique : <input type="text" class="form-control form-control-lg" value={this.state.nameVision} onChange={this.handleChangeNameVision}/></label>
                        </div>

                        <div class="form-group">
                            <span role="alert" class={this.state.alertVisionClass}>{this.state.alertVisionMessage}</span>
                        </div>

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

export default VisionForm;