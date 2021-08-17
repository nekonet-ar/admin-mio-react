import React from 'react'
import {
    Row,
    Col,
    UncontrolledTooltip,
} from "reactstrap"

const PlantImgForm = ({
    id,
    urlimg,
    listaImgNvas,
    setListaImgNvas,
    PlantillaNvasImg,
    detallesBool,
    listaImgEliminadas,
    setListaImgEliminadas,
    idImg
}) => {

    const EliminarImgNva = (e, key) => {
        e.preventDefault()
        let imagArray = listaImgNvas
        imagArray.splice(key, 1)
        setListaImgNvas(imagArray)
        PlantillaNvasImg()
    }

    const NvaImagenEliminada = (e, id, key) => {
        e.preventDefault()
        let imgEliminadasArray = listaImgEliminadas
        imgEliminadasArray.push(id)
        setListaImgEliminadas(imgEliminadasArray)
        let imagArray = listaImgNvas
        imagArray.splice(key, 1)
        setListaImgNvas(imagArray)
        PlantillaNvasImg()
    }

    return (
        <Col md="4" key={id}>
            {
                detallesBool ?
                    <button
                        className="btn-icon-clipboard"
                        id={"img" + id}
                        type="button"
                        style={{ padding: "15px" }}
                        onClick={e => NvaImagenEliminada(e, idImg, id)}
                    >
                        <Row>
                            <Col>
                                <img
                                    src={urlimg}
                                    style={{ width: "100%" }}
                                    alt={"img" + id}
                                />
                            </Col>
                        </Row>
                    </button>
                    :
                    <button
                        className="btn-icon-clipboard"
                        id={"img" + id}
                        type="button"
                        style={{ padding: "15px" }}
                        onClick={e => EliminarImgNva(e, id)}
                    >
                        <Row>
                            <Col>
                                <img
                                    id={"img_" + id}
                                    src={urlimg}
                                    style={{ width: "100%" }}
                                    alt={"img" + id}
                                />
                            </Col>
                        </Row>
                    </button>
            }

            <UncontrolledTooltip
                delay={0}
                trigger="hover focus"
                target={"img" + id}
                placement="top"
            >
                Eliminar imagen
            </UncontrolledTooltip>
        </Col>
    )
}

export default PlantImgForm