import React from 'react'
import {
    Row,
    Col,
    FormGroup,
    Input
} from "reactstrap"

const InfoPedidoDomi = ({
    sucCorreo,
    provincia,
    ciudad,
    telefono,
    nombre,
    apellido,
    codArea,
    casillaEmail
}) => {

    return (
        <>
            <Row>
                <Col lg="12">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-email"
                        >
                            Nombre y Apellido
                    </label>
                        <Input
                            className="form-control-alternative"
                            id="input-email"
                            type="text"
                            value={nombre + " " + apellido}
                            disabled
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col lg="6">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-email"
                        >
                            Provincia
                    </label>
                        <Input
                            className="form-control-alternative"
                            id="input-email"
                            type="text"
                            value={provincia}
                            disabled
                        />
                    </FormGroup>
                </Col>
                <Col lg="6">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-email"
                        >
                            Ciudad
                    </label>
                        <Input
                            className="form-control-alternative"
                            id="input-email"
                            type="text"
                            value={ciudad}
                            disabled
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col lg="12">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-email"
                        >
                            Sucursal de Correo Argentino
                    </label>
                        <Input
                            className="form-control-alternative"
                            id="input-email"
                            type="text"
                            value={sucCorreo}
                            disabled
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col lg="4">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-email"
                        >
                            Cód. Área
                    </label>
                        <Input
                            className="form-control-alternative"
                            id="input-email"
                            type="text"
                            value={codArea}
                            disabled
                        />
                    </FormGroup>
                </Col>
                <Col lg="8">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-email"
                        >
                            Telefóno
                    </label>
                        <Input
                            className="form-control-alternative"
                            id="input-email"
                            type="text"
                            value={telefono}
                            disabled
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col lg="12">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-email"
                        >
                            Correo electrónico
                    </label>
                        <Input
                            className="form-control-alternative"
                            id="input-email"
                            type="text"
                            value={casillaEmail}
                            disabled
                        />
                    </FormGroup>
                </Col>
            </Row>
        </>
    )
}

export default InfoPedidoDomi