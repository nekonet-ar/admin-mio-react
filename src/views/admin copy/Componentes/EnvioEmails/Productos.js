import React, { useState, useEffect } from 'react'
import {
    Row,
    Col
} from "reactstrap"

import Paginacion from '../Paginacion/Paginacion2'
import ListadoTable from '../Listados/ListadoTable2'
import FilaProd from '../Listados/SubComponentes/FilaProducto2'

import ModalNewProducts from './SubComponentes/ModalNewProduct'

const titulos = ["Producto", "Categoría", "Subcategoria", "Proveedor", "Precio", "Descuento", ""]

const Productos = ({
    listaProd,
    setListaProd
}) => {
    const [pagina, setPagina] = useState(1)
    const [listado, setListado] = useState(<></>)
    const [paginasArray, setPaginasArray] = useState([1])
    const [call3, setCall3] = useState(false)
    const [plantPaginas, setPlantPaginas] = useState([])
    const [ultimaPag, setUltimaPag] = useState(0)
    const [modlNewProd, setModalNewProd] = useState(false)

    useEffect(() => {
        RellenarEmails()
        // eslint-disable-next-line
    }, [pagina, listaProd.length, call3])

    const RellenarEmails = () => {
        const desde = parseInt(((pagina - 1) * 5))
        const hasta = parseInt(desde + 5)
        const totalLista = parseInt(listaProd.length)
        if (totalLista > 0) {
            const paginasFloat = parseFloat(totalLista / 5)
            const paginasInt = parseInt(totalLista / 5)
            let totalPaginas
            let listPaginas = []

            if (paginasFloat > paginasInt) {
                totalPaginas = paginasInt + 1
            } else {
                totalPaginas = paginasInt
            }
            setUltimaPag(totalPaginas)
            for (let i = 0; i < totalPaginas; i++) {
                listPaginas.push(i + 1)
            }
            setPaginasArray(listPaginas)
            setListado(
                // eslint-disable-next-line
                listaProd.map((item, key) => {
                    if (key >= desde && key < hasta) {
                        return (
                            <FilaProd
                                id={key}
                                item={item}
                                listaProd={listaProd}
                                setListaProd={setListaProd}
                                call3={call3}
                                setCall3={setCall3}
                            />
                        )
                    }
                })
            )
        } else {
            setListado(
                <tr>
                    <td>No hay productos cargados en la lista</td>
                </tr>
            )
        }
    }

    return (
        <>
            <ModalNewProducts
                setListaProd={setListaProd}
                modalTog={modlNewProd}
                setModalTog={setModalNewProd}
                listaProd={listaProd}
            />
            <Row style={{ padding: "15px", paddingTop: 0 }}>
                <Col lg="12">
                    <h2 style={{ textAlign: "center" }}>Productos:</h2>
                </Col>
            </Row>
            <Row style={{ padding: "15px", margin: "15px", marginTop: 0 }}>
                <Col style={{ border: "2px solid red", margin: "10px", padding: "15px", paddingTop: 0 }}>
                    <div style={{ marginBottom: "50px" }}>
                        <ListadoTable
                            listado={listado}
                            titulos={titulos}
                        />
                    </div>
                    <Row>
                        <Col lg="6" style={{ textAlign: "center", padding: "10px", paddingTop: 0 }}>
                            <button
                                className="btn btn-primary"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setModalNewProd(true)
                                }}
                            >
                                Agregar
                            </button>
                        </Col>
                        <Col lg="6" style={{ textAlign: "center", padding: "10px", paddingTop: 0 }}>
                            <Paginacion
                                setPagina={(pagina) => setPagina(pagina)}
                                pagina={pagina}
                                plantPaginas={plantPaginas}
                                ultimaPag={ultimaPag}
                                setPlantPaginas={(plantPaginas) => setPlantPaginas(plantPaginas)}
                                setUltimaPag={(ultimaPag) => setUltimaPag(ultimaPag)}
                                totalPag={paginasArray.length}
                                cantTotal={paginasArray}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default Productos