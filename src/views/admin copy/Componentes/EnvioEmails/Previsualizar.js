import React from 'react'
import {
    Modal,
    Button
} from "reactstrap"
const Previsualizar = ({ prevModal, setPrevModal, htmlPrev }) => {
    return (
        <Modal
            size="lg"
            isOpen={prevModal}
            toggle={() => setPrevModal(false)}
        >
            <div className="modal-header">
                <h4 className="modal-title">
                    Previsualización:
            </h4>
                <button
                    aria-label="Close"
                    className="close"
                    data-dismiss="modal"
                    type="button"
                    onClick={() => setPrevModal(false)}
                >
                    <span aria-hidden={true}>×</span>
                </button>
            </div>
            <div className="modal-body" style={{ background: "#014875" }}>
                <div dangerouslySetInnerHTML={{ __html: htmlPrev }} />
            </div>
            <div className="modal-footer">
                <Button
                    color="warning"
                    data-dismiss="modal"
                    type="button"
                    onClick={() => setPrevModal(false)}
                >
                    Cerrar
            </Button>
            </div>
        </Modal>
    )
}

export default Previsualizar