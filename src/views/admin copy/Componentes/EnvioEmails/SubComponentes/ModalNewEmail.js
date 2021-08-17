import React, { useState } from 'react'
import {
    Modal,
    Form,
    FormGroup,
    Input
} from "reactstrap"

const ModalNewEmail = ({
    modalTog,
    setModalTog,
    listaEmails,
    setListaEmails,
    setAlertar,
    setMsgStrong,
    setMsgGralAlert,
    setSuccessAlert,
    alertar
}) => {
    const [newEmailTxt, setNewEmailTxt] = useState("")
    const AddEmail = (e) => {
        e.preventDefault()
        let listadito = listaEmails
        listadito.unshift({
            "email": newEmailTxt
        })
        setListaEmails(listadito)
        setNewEmailTxt("")
        setMsgStrong("Email agregado!")
        setMsgGralAlert("")
        setSuccessAlert(true)
        setAlertar(!alertar)
    }

    return (
        <Modal
            className="modal-dialog-centered"
            isOpen={modalTog}
            toggle={() => setModalTog(false)}
        >
            <div className="modal-header">
                <h4 className="modal-title">
                    Agregar Email:
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
                <Form onSubmit={e => AddEmail(e)}>
                    <FormGroup>
                        <Input
                            className="form-control-alternative"
                            id="input-email"
                            type="email"
                            placeholder="Email..."
                            value={newEmailTxt}
                            onChange={e => setNewEmailTxt(e.target.value)}
                            required
                        />

                    </FormGroup>
                    <button
                        className="btn btn-primary"
                        type="submit"
                    >
                        Agregar
                </button>
                </Form>
            </div>
        </Modal>
    )
}

export default ModalNewEmail