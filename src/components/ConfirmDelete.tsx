import { Button, Modal } from 'react-bootstrap';
import React from 'react'


type MyProps = { title:string, text:any };
type MyState = { show: boolean };

export default class ConfirmDelete extends React.Component<MyProps, MyState> {
    promiseInfo:any
    constructor(props:any){
      super(props)
      this.state = {
        show: false
      };
  
      this.promiseInfo = {};
    }
    show = async () => {
      return new Promise((resolve, reject) => {
        this.promiseInfo = {
          resolve,
          reject
        };
        this.setState({
          show: true
        });
      });
    };
  
    hide = async () => {
      const { resolve, reject } = this.promiseInfo;
      this.setState({
        show: false
      });
      reject()
    };

    ok = async ()=>{
        const { resolve, reject } = this.promiseInfo;
        this.setState({
          show: false
        });
        resolve()
    }
  
    render() {
      const { show } = this.state;
      
      return (
        <>

  
        <Modal show={show} onHide={async ()=> await this.hide()}>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.props.text}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={async ()=> await this.hide()}>
              No
            </Button>
            <Button variant="primary" onClick={async ()=> await this.ok()}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
      );
    }
  }