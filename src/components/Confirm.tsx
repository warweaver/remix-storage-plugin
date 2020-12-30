import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap';

interface ConfirmProps {
  //callback():void
  show:boolean
}

export const Confirm: React.FC<ConfirmProps> = (props) => {
    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleYes = () => {
      const [resolve] = promiseInfo
      resolve()
    }

    let promiseInfo:any[] = []

    const showModal = async()=>{
      return new Promise((resolve,reject)=>{
        promiseInfo = [
          resolve,
          reject
        ];
        handleShow()
      })
    }
  
    return (
      <>
        <Button variant="primary" onClick={handleShow}>
          Launch demo modal
        </Button>
  
        <Modal show={props.show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>CONFIRM DELETING FILES</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to erase all the files you are working on?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              No
            </Button>
            <Button variant="primary" onClick={handleYes}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
}