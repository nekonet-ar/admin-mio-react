import React from 'react'
import {
    Form,
    FormGroup,
    InputGroupAddon,
    InputGroupText,
    Input,
    InputGroup,
} from "reactstrap"

const BusquedaProdForm = ({
    busquedaBool,
    setPalabraBuscada,
    palabraBuscada,
    setBusquedaBool,
    call,
    setCall,
    tittle
}) => {

    const BuscarPalabra = (e) => {
        e.preventDefault()
        setBusquedaBool(true)
        setCall(!call)
    }

    const CancelaBusqueda = (e) => {
        e.preventDefault()
        setBusquedaBool(false)
        setPalabraBuscada("")
        setCall(!call)
    }

    if (busquedaBool) {
        return (
            <Form
                className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto"
                style={{ textAlign: "right" }}
            >
                <FormGroup className="mb-0" style={{ marginLeft: "auto" }}>
                    <span style={{ marginRight: "15px" }}>Palabra buscada</span>
                    <InputGroup className="input-group-alternative" style={{ borderRadius: 0 }}>
                        <Input
                            value={palabraBuscada}
                            type="text"
                            style={{ color: "#7a66de", padding: "30px", fontWeight: "bold", fontSize: "18px" }}
                            disabled
                        />
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                                <button
                                    className="btn btn-danger"
                                    onClick={e => CancelaBusqueda(e)}
                                >X</button>
                            </InputGroupText>
                        </InputGroupAddon>
                    </InputGroup>
                </FormGroup>
            </Form>
        )
    } else {
        return (
            <Form
                className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto"
                style={{ textAlign: "right" }}
                onSubmit={e => BuscarPalabra(e)}
            >
                <FormGroup className="mb-0" style={{ marginLeft: "auto" }}>
                    <span style={{ marginRight: "15px" }}>{tittle}</span>
                    <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                                <i className="fas fa-search" style={{ color: "black" }} />
                            </InputGroupText>
                        </InputGroupAddon>
                        <Input
                            placeholder="Buscar"
                            type="text"
                            style={{ color: "black" }}
                            value={palabraBuscada}
                            onChange={e => setPalabraBuscada(e.target.value)}
                        />
                    </InputGroup>
                </FormGroup>
            </Form>
        )
    }
}

export default BusquedaProdForm