import React, { useEffect } from 'react'
import axios from 'axios'
import UrlNodeServer from '../../../../Globals/NodeServer'
import {
    Row,
    Col,
    FormGroup,
    Input,

} from "reactstrap"
import PlantCategoriasForm from './SubComponentes/Categorias/PlantCategorias'

const Categorias = ({
    categoriaNvo,
    setCategoriaNvo,
    plantCat,
    setPlantCat,
    listaCat,
    setListaCat
}) => {

    useEffect(() => {
        LlenarListCat()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        PlantCategorias()
        // eslint-disable-next-line
    }, [listaCat.length, categoriaNvo])

    const LlenarListCat = async () => {
        await axios.get(UrlNodeServer.GetCategories)
            .then(res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)

                if (status === 200) {
                    setListaCat(respuesta.result)
                }
            })
    }

    const PlantCategorias = async () => {
        setPlantCat(
            listaCat.map((categoria, key) => {
                return (
                    <PlantCategoriasForm
                        key={key}
                        id={key}
                        categoria={categoria}
                        categoriaNvo={categoriaNvo}
                        setCategoriaNvo={(categoriaNvo) => setCategoriaNvo(categoriaNvo)}
                    />
                )
            })
        )
    }


    return (
        <>
            <Col lg="6">
                <FormGroup>
                    <label
                        className="form-control-label"
                        htmlFor="input-email"
                    >
                        Categoría
                        </label>
                    <Input
                        className="form-control-alternative"
                        id="input-email"
                        placeholder="Categoría..."
                        type="text"
                        value={categoriaNvo}
                        onChange={e => setCategoriaNvo(e.target.value)}
                        style={{ textTransform: "capitalize" }}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Row style={{ background: "white", borderRadius: "15px", marginLeft: "5px", marginRight: "5px" }}>
                        {plantCat}
                    </Row>
                </FormGroup>
            </Col>
        </>
    )
}

export default Categorias