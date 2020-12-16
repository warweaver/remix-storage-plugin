import React from 'react'
import { Button, Modal } from "react-bootstrap";

interface ConnectionWarningProps {

}

export const ConnectionWarning: React.FC<ConnectionWarningProps> = ({}) => {
        return (    <>
            <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
              <Modal.Body>
                This app won't work properly when you are not on https and your browser blocks third party cookies.
              </Modal.Body>
            </Modal>
          </>);
}