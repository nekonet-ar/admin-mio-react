import React from 'react'
import {
    Modal,
    Button
} from "reactstrap"

const ModalLocation = ({ modalTog, setModalTog, plantLocation }) => {

    return (
        <Modal
            className="modal-dialog-centered"
            isOpen={modalTog}
            toggle={() => setModalTog(false)}
        >
            <div className="modal-header">
                <h4 className="modal-title">
                    Provincias:
            </h4>
                <button
                    aria-label="Close"
                    className="close"
                    data-dismiss="modal"
                    type="button"
                    onClick={() => setModalTog(false)}
                >
                    <span aria-hidden={true}>×</span>
                </button>
            </div>
            <div className="modal-body">
                {plantLocation}
            </div>
            <div className="modal-footer">
                <Button
                    color="warning"
                    data-dismiss="modal"
                    type="button"
                    onClick={() => setModalTog(false)}
                >
                    Cerrar
            </Button>
            </div>
        </Modal>
    )
}

export default ModalLocation