import React, { useEffect } from 'react'
import {
    Row,
    Col,
    FormGroup,
    Input,
} from "reactstrap";
import ExtraInfoForm from './ExtraInfoForm3'

import StockForm from './SubComponentes/Stock/StockForm'
import VariedadesForm from './SubComponentes/Stock/VariedadesForm'

const InfoForm = ({
    nombreNvo,
    setNombreNvo,
    precioVtaNvo,
    setPrecioVtaNvo,
    precioCpraNvo,
    setPrecioCpraNvo,
    cpraMaxNvo,
    setCpraMaxNvo,
    descrCortaNvo,
    setDescrCortaNvo,
    descrLargaNvo,
    setDescrLargaNvo,
    peso,
    setPeso,
    sizeX,
    setSizeX,
    sizeY,
    setSizeY,
    sizeZ,
    setSizeZ,
    listaVarNvas,
    setListaVarNvas,
    variedadesBool,
    setVariedadesBool,
    tipoVar,
    setTipoVar,
    listaTipoasVar
}) => {

    useEffect(() => {
        console.log('listaVarNvas.length', listaVarNvas.length)
        if (listaVarNvas.length) {
            if (listaVarNvas.length > 0) {
                setVariedadesBool(true)
            }
        }
        // eslint-disable-next-line
    }, [listaVarNvas.length])

    return (
        <>
            <Row>
                <Col lg="12">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-username"
                        >
                            Nombre
                        </label>
                        <Input
                            className="form-control-alternative"
                            id="input-username"
                            placeholder="Nombre del Producto..."
                            type="text"
                            value={nombreNvo}
                            onChange={e => setNombreNvo(e.target.value)}
                            required
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
                            Precio de Venta
                        </label>
                        <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="Precio de Venta..."
                            type="number"
                            value={precioVtaNvo}
                            onChange={e => setPrecioVtaNvo(e.target.value)}
                            min={parseFloat(precioCpraNvo)}
                            step={0.01}
                            required
                        />
                    </FormGroup>
                </Col>
                <Col lg="6">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-email"
                        >
                            Precio de Compra
                        </label>
                        <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="Precio de Compra..."
                            type="number"
                            value={precioCpraNvo}
                            onChange={e => setPrecioCpraNvo(e.target.value)}
                            min={0.00}
                            required
                        />
                    </FormGroup>
                </Col>
            </Row>
            <hr className="my-4" />
            <Row>
                {
                    !variedadesBool ?
                        <StockForm
                            setVariedadesBool={setVariedadesBool}
                            cpraMaxNvo={cpraMaxNvo}
                            setCpraMaxNvo={setCpraMaxNvo}
                        /> :
                        <VariedadesForm
                            setVariedadesBool={setVariedadesBool}
                            tipoVar={tipoVar}
                            setTipoVar={setTipoVar}
                            listaVarNvas={listaVarNvas}
                            setListaVarNvas={setListaVarNvas}
                            listaTipoasVar={listaTipoasVar}
                        />
                }
            </Row>
            <hr className="my-4" />
            <Row>
                <Col lg="3">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-email"
                        >
                            Peso (gramos)
                        </label>
                        <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="Peso..."
                            type="number"
                            value={peso}
                            onChange={e => setPeso(e.target.value)}
                            max={25000}
                            min={1}
                            step={1}
                            required
                        />
                    </FormGroup>
                </Col>
                <Col lg="3">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-email"
                        >
                            Largo (centimetros)
                        </label>
                        <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="Largo..."
                            type="number"
                            value={sizeX}
                            onChange={e => setSizeX(e.target.value)}
                            max={150}
                            min={1}
                            step={1}
                            required
                        />
                    </FormGroup>
                </Col>
                <Col lg="3">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-email"
                        >
                            Ancho (centimetros)
                        </label>
                        <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="Ancho..."
                            type="number"
                            value={sizeY}
                            onChange={e => setSizeY(e.target.value)}
                            max={150}
                            min={1}
                            step={1}
                            required
                        />
                    </FormGroup>
                </Col>
                <Col lg="3">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-email"
                        >
                            Alto (centimetros)
                        </label>
                        <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="Alto..."
                            type="number"
                            value={sizeZ}
                            onChange={e => setSizeZ(e.target.value)}
                            max={150}
                            min={1}
                            step={1}
                            required
                        />
                    </FormGroup>
                </Col>
            </Row>
            <ExtraInfoForm
                model={descrCortaNvo}
                setModel={setDescrCortaNvo}
                titulo="Descripción corta"
            />
            <ExtraInfoForm
                model={descrLargaNvo}
                setModel={setDescrLargaNvo}
                titulo="Descripción larga"
            />
        </>
    )
}

export default InfoForm