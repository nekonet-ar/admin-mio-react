import React, { useEffect, useState } from "react";
import { useFetch } from '../../Hooks/UseFetchPost'
import axios from 'axios'
import { useActividad } from '../../Hooks/UseNvaActividad'
import { useToken } from '../../Hooks/UseFetchToken'
import { Redirect } from "react-router-dom"
// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Container,
    Row,
    Spinner,
    Col,
    Form,
    FormGroup,
    Input,
    Label
} from "reactstrap"
// core components
import Header from "components/Headers/Header.js";
import UrlNodeServer from '../../Globals/NodeServer'

import InfoForm from './Componentes/Productos/InfoForm'
import Paginacion from './Componentes/Paginacion/Paginacion'
import FilaProducto from './Componentes/Listados/SubComponentes/FilaProducto'
import ListadoTable from './Componentes/Listados/ListadoTable'
import CategoriasForm from './Componentes/Productos/Categorias'
import SubCAtegoriasForm from './Componentes/Productos/SubCategorias'
import TagsForm from './Componentes/Productos/TagsForm'
import ProgressBar1 from './Componentes/ProgressBar/ProgressForm1'
import BusquedaForm from './Componentes/Productos/BusquedaForm'
import ImagenesForm from './Componentes/Productos/ImagenesForm'
import AlertaForm from './Componentes/Alertas/Alerta1'
import ProveedoresForm from './Componentes/Productos/ProveedorForm'

const titulos = ["Producto", "Categoría", "Subcategoria", "Proveedor", "Precio", "Descuento", "Habilitado", ""]

const ProductsItems = () => {
    const [alertar, setAlertar] = useState(false)
    const [msgStrongAlert, setMsgStrong] = useState("")
    const [msgGralAlert, setMsgGralAlert] = useState("")
    const [successAlert, setSuccessAlert] = useState(false)
    const [esperar, setEsperar] = useState(false)
    const [esperar2, setEsperar2] = useState(false)
    const [cargaImg, setCargaImg] = useState(false)
    const [progressImg, setProgressImg] = useState(0)
    const [nvaOffer, setNvaOffer] = useState(false)
    const [nombreNvo, setNombreNvo] = useState("")
    const [precioVtaNvo, setPrecioVtaNvo] = useState(0)
    const [precioCpraNvo, setPrecioCpraNvo] = useState(0)
    const [cpraMaxNvo, setCpraMaxNvo] = useState(0)
    const [descrCortaNvo, setDescrCortaNvo] = useState("")
    const [descrLargaNvo, setDescrLargaNvo] = useState("")
    const [categoriaNvo, setCategoriaNvo] = useState("")
    const [subCatNvo, setSubCatNvo] = useState("")
    const [tagNvo, setTagNvo] = useState("")
    const [tagsList, setTagsList] = useState([])
    const [tagsPlant, setTagsPlant] = useState(<></>)
    const [model, setModel] = useState("")
    const [listaImgNvas, setListaImgNvas] = useState([])
    const [plantNvasImg, setPlantNvasImg] = useState(<></>)
    const [busquedaBool, setBusquedaBool] = useState(false)
    const [palabraBuscada, setPalabraBuscada] = useState("")
    const [plantPaginas, setPlantPaginas] = useState([])
    const [ultimaPag, setUltimaPag] = useState(0)
    const [listaCat, setListaCat] = useState([])
    const [listaSubCat, setListaSubCat] = useState([])
    const [plantCat, setPlantCat] = useState(<></>)
    const [plantSubCat, setPlantSubCat] = useState(<></>)
    const [listadoTags, setListadoTags] = useState([])
    const [plantTags, setPlantTags] = useState(<></>)
    const [modalListaTags, setModalListaTags] = useState(false)
    const [listado, setListado] = useState([])
    const [url, setUrl] = useState("")
    const [call, setCall] = useState(false)
    const [pagina, setPagina] = useState(1)
    const [detallesBool, setDetallesBool] = useState(false)
    const [idDetalle, setIdDetalle] = useState(0)
    const [listaImgEliminadas, setListaImgEliminadas] = useState([])
    const [relistar, setRelistar] = useState(false)
    const [cancelaImg, setCancelImg] = useState(false)
    const [peso, setPeso] = useState(0)
    const [sizeX, setSizeX] = useState(0)
    const [sizeY, setSizeY] = useState(0)
    const [sizeZ, setSizeZ] = useState(0)
    const [copiarDet, setCopiarDet] = useState(false)
    const [listaVarNvas, setListaVarNvas] = useState([])
    const [variedadesBool, setVariedadesBool] = useState(false)
    const [tipoVar, setTipoVar] = useState("")
    const [proveedor, setProveedor] = useState("")
    const [listaProveedores, setListaProveedores] = useState([])
    const [aumentoBool, setAumentoBool] = useState(false)
    const [porcAument, setPorcAument] = useState("")
    const [redondeo, setRedondeo] = useState(false)
    const [descuentoTogg, setDescuentoTogg] = useState(false)
    const [etiquetaTogg, setEtiquetaTogg] = useState(false)
    const [etiquetaGral, setEtiquetaGral] = useState("")
    const [vtoDesc, setVtoDesc] = useState("")
    const [minDate, setMinDate] = useState("")

    const { data, loading, error } = useFetch(
        url,
        {
            pageAct: pagina,
            searchBool: busquedaBool,
            searchItem: palabraBuscada
        },
        call
    )
    const [url2, setUrl2] = useState("")
    const [call2, setCall2] = useState(false)
    const [cookie, setCookie] = useState("")
    const { errorT } = useToken(
        url2,
        call2,
        cookie
    )
    const [nvaActCall, setNvaActCall] = useState(false)
    const [actividadStr, setActividadStr] = useState("")
    useActividad(
        nvaActCall,
        actividadStr
    )

    useEffect(() => {
        if (!loading) {
            ListarProveedores()
            if (!error) {
                if (data.cantTotal) {
                    ListarOfertas()
                } else {
                    setListado(
                        <tr style={{ textAlign: "center", width: "100%" }}>
                            <td>
                                No hay productos cargados
                            </td>
                        </tr>
                    )
                }
            }
        }
        // eslint-disable-next-line
    }, [loading])

    useEffect(() => {
        setCookie(localStorage.getItem("loginInfo"))
        setUrl2(UrlNodeServer.Veriflog)
        setCall2(!call2)
        setUrl(UrlNodeServer.ProductList)
        setCall(!call)
        ListarProveedores()
        HoyFuntion()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (detallesBool) {
            DetallesProducto()
        }
        // eslint-disable-next-line
    }, [detallesBool])

    useEffect(() => {
        if (copiarDet) {
            DetallesProducto()
            setNvaOffer(true)
        }
        // eslint-disable-next-line
    }, [copiarDet])

    const HoyFuntion = () => {
        const hoyFecha = new Date()
        const anio = hoyFecha.getFullYear()
        let mes = String(parseInt(hoyFecha.getMonth()) + 1)
        let dia = String(hoyFecha.getDate())

        console.log(`mes.length`, mes.length)
        if (mes.length < 2) {
            mes = "0" + String(mes)
        }
        if (dia.length < 2) {
            dia = "0" + String(dia)
        }
        const hoyStr = anio + "-" + mes + "-" + dia
        console.log(`hoyStr`, hoyStr)
        setMinDate(hoyStr)
    }

    const ListarProveedores = async () => {
        await axios.get(UrlNodeServer.ListaProveedores)
            .then(res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)

                if (status === 200) {
                    const listado = respuesta.result
                    const cant = parseInt(listado.length)
                    if (cant > 0) {
                        let lista = []
                        // eslint-disable-next-line
                        listado.map(proveedor => {
                            lista.push(proveedor)
                        })
                        setListaProveedores(lista)
                    } else {
                        setListaProveedores([])
                    }
                } else {
                    setListaProveedores([])
                }
            })
    }

    const ListarOfertas = () => {
        let totallista
        try {
            totallista = parseInt(data.totalPag)
        } catch (error) {
            totallista = 0
        }
        if (totallista === 0) {
            setListado(
                <tr style={{ textAlign: "center", width: "100%" }}>
                    <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}>No hay productos cargados</span>
                </tr>
            )
        } else {
            setUltimaPag(data.totalPag)
            setListado(
                data.listado.map((item, key) => {
                    let primero
                    if (key === 0) {
                        primero = true
                    } else {
                        primero = false
                    }
                    return (
                        <FilaProducto
                            id={key}
                            key={key}
                            item={item}
                            setActividadStr={() => setActividadStr()}
                            nvaActCall={nvaActCall}
                            setNvaActCall={(nvaActCall) => setNvaActCall(nvaActCall)}
                            alertar={alertar}
                            setAlertar={(alertar) => setAlertar(alertar)}
                            setMsgStrong={(msgStrong) => setMsgStrong(msgStrong)}
                            setMsgGralAlert={(msgGralAlert) => setMsgGralAlert(msgGralAlert)}
                            setSuccessAlert={(successAlert) => setSuccessAlert(successAlert)}
                            setCall={(call) => setCall(call)} ººº
                            call={call}
                            setEsperar={() => setEsperar()}
                            nvaOffer={nvaOffer}
                            setDetallesBool={(detallesBool) => setDetallesBool(detallesBool)}
                            setIdDetalle={(idDetalle) => setIdDetalle(idDetalle)}
                            setCopiarDet={setCopiarDet}
                            primero={primero}
                            pagina={pagina}
                            setPagina={setPagina}
                        />
                    )
                })
            )
        }
    }

    const NvaOferta = (e) => {
        e.preventDefault()
        setNvaOffer(true)
        setCall(!call)
        setTimeout(() => {
            document.getElementById("input-username").select()
            var elmnt = document.getElementById("input-username")
            elmnt.scrollIntoView()
            window.scrollBy(0, -600)
        }, 800);
    }

    const CancelaNvoOff = (e) => {
        e.preventDefault()
        setNvaOffer(false)
        setDetallesBool(false)
        ResetStatesForm()
        setCancelImg(!cancelaImg)
        setCall(!call)
    }

    const subirImagenes = (result, modifica, listamod) => {
        let listadoISubir
        if (modifica) {
            listadoISubir = listamod
        } else {
            listadoISubir = listaImgNvas
        }
        const cantImagenes = parseInt(listadoISubir.length)
        let progreso = 0
        let progreso2 = 0
        let paso = parseInt((100 / cantImagenes))
        const corrobora = paso * cantImagenes

        if (corrobora > 100) {
            paso = paso - 1
        }
        // eslint-disable-next-line
        result.map((item, key) => {
            fetch(listadoISubir[key][0])
                .then(res => res.blob())
                .then(blob => {
                    const filemini = new File([blob], item.id + ".jpg", {
                        type: 'image/jpeg'
                    });

                    var formData = new FormData();
                    formData.append("file", filemini);
                    formData.append("otros", "oreos");

                    // Example POST method implementation:
                    async function postData(url = '', data = {}) {
                        // Default options are marked with *
                        const response = await fetch(url, {
                            method: 'POST',
                            body: data
                        });
                        return response;
                    }
                    postData(UrlNodeServer.UploadImgProd, formData)
                        .then(async data => {
                            let respuesta = await data.json()
                            const status = parseInt(respuesta.status)
                            if (status === 200) {
                                await axios.post(UrlNodeServer.OptmizedImg, { idImg: item })
                                    .then(res => {

                                    })
                                progreso = progreso + paso
                                progreso2 = progreso2 + 1
                                setProgressImg(progreso)
                                if (progreso2 === cantImagenes) {
                                    setProgressImg(100)
                                    setTimeout(() => {
                                        setCargaImg(false)
                                        setProgressImg(0)
                                        if (modifica) {
                                            setActividadStr("El usuario ha modificado la oferta '" + nombreNvo + "'")
                                            setNvaActCall(!nvaActCall)
                                            setMsgStrong("Producto e imagenes modificadas con éxito!")
                                            setMsgGralAlert("")
                                            setSuccessAlert(true)
                                            setAlertar(!alertar)
                                            setCall(!call)
                                            setNvaOffer(false)
                                            setDetallesBool(false)
                                            ResetStatesForm()
                                        } else {
                                            setActividadStr("El usuario ha agregado la oferta '" + nombreNvo + "'")
                                            setNvaActCall(!nvaActCall)
                                            setMsgStrong("Producto e imagenes caragadas con éxito!")
                                            setMsgGralAlert("")
                                            setSuccessAlert(true)
                                            setAlertar(!alertar)
                                            setCall(!call)
                                            ResetStatesForm()
                                        }
                                    }, 800);
                                }
                            } else {
                                setCargaImg(false)
                                setMsgStrong("No se pudieron cargar las imagenes correctamente!")
                                setMsgGralAlert("")
                                setSuccessAlert(false)
                                setAlertar(!alertar)
                            }
                        });
                });
        })
    }

    const NvoProducto = async (e) => {
        e.preventDefault()
        setEsperar(true)
        const cantimg = parseInt(listaImgNvas.length)
        let listaImgNuevas = []
        let urlCopias = []
        if (cantimg > 0) {
            // eslint-disable-next-line
            listaImgNvas.map(link => {
                const protocolo = link[0].substring(0, 4)
                if (protocolo !== "http") {
                    listaImgNuevas.push([link[0], link[1]])
                } else {
                    urlCopias.push(link[0])
                }
            })
        }

        const cantImagenes2 = parseInt(listaImgNuevas.length)

        e.preventDefault()
        setEsperar(true)
        const cantImagenes = parseInt(listaImgNvas.length)
        if (cantImagenes > 1) {
            const datos = {
                name: nombreNvo,
                salePrice: precioVtaNvo,
                shopPrice: precioCpraNvo,
                shortDescr: descrCortaNvo,
                longDescr: descrLargaNvo,
                category: categoriaNvo,
                subCategory: subCatNvo,
                cantMaxSale: cpraMaxNvo,
                listaTags: tagsList,
                cantImg: cantImagenes2,
                extrainfohtml: model,
                peso: peso,
                sizeX: sizeX,
                sizeY: sizeY,
                sizeZ: sizeZ,
                listaCopiaImg: urlCopias,
                listaVarNvas: listaVarNvas,
                tipoVar: tipoVar,
                proveedor: proveedor
            }

            await axios.post(UrlNodeServer.NvoProducto, datos)
                .then(res => {
                    setEsperar(false)
                    const respuesta = res.data
                    const status = parseInt(respuesta.status)
                    if (status === 200) {

                        const result = respuesta.result
                        if (cantImagenes2 > 0) {
                            setCargaImg(true)
                            subirImagenes(result, true, listaImgNuevas)
                        } else {
                            setActividadStr("El usuario ha agregado la oferta '" + nombreNvo + "'")
                            setNvaActCall(!nvaActCall)
                            setMsgStrong("Producto e imagenes caragadas con éxito!")
                            setMsgGralAlert("")
                            setSuccessAlert(true)
                            setAlertar(!alertar)
                            setCall(!call)
                            ResetStatesForm()
                        }
                    } else {
                        setMsgStrong("Hubo un error al querer cargar las imagenes")
                        setMsgGralAlert("")
                        setSuccessAlert(false)
                        setAlertar(!alertar)
                    }
                })
        } else if (cantImagenes > 10) {
            setEsperar(false)
            setMsgStrong("La cantidad máxima de imagenes a cargar son 10!")
            setMsgGralAlert("")
            setSuccessAlert(false)
            setAlertar(!alertar)
        } else {
            setEsperar(false)
            setMsgStrong("La cantidad mínima de imagenes a cargar son 2!")
            setMsgGralAlert("")
            setSuccessAlert(false)
            setAlertar(!alertar)
        }
    }

    const ResetStatesForm = () => {
        setNombreNvo("")
        setPrecioVtaNvo(0)
        setPrecioCpraNvo(0)
        setCpraMaxNvo(0)
        setDescrCortaNvo("")
        setDescrLargaNvo("")
        setCategoriaNvo("")
        setSubCatNvo("")
        setTagsList([])
        setListaImgNvas([])
        setListaImgEliminadas([])
        setPlantNvasImg(<></>)
        setModel("")
        setPeso(0)
        setSizeX(0)
        setSizeY(0)
        setSizeZ(0)
        setVariedadesBool(false)
        setCopiarDet(false)
        setListaVarNvas([])
        setTipoVar("")
        setListaProveedores([])
        setProveedor("")
    }

    const DetallesProducto = async () => {
        setEsperar2(true)
        await axios.get(UrlNodeServer.GetDetProduct + idDetalle)
            .then(async res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const detalles = respuesta.result[0]

                    setNombreNvo(detalles.name)
                    setPrecioVtaNvo(detalles.price)
                    setPrecioCpraNvo(detalles.precioCompra)
                    setCpraMaxNvo(detalles.stock)
                    setDescrCortaNvo(detalles.shortDescription)
                    setDescrLargaNvo(detalles.fullDescription)
                    setCategoriaNvo(detalles.category[0])
                    setSubCatNvo(detalles.category[1])
                    setModel(detalles.infoExtra)
                    setPeso(detalles.peso)
                    setSizeX(detalles.sizeX)
                    setSizeY(detalles.sizeY)
                    setSizeZ(detalles.sizeZ)
                    setProveedor(detalles.proveedor)
                    setListaVarNvas(detalles.listaVarNvas)
                    console.log('detalles.listaVarNvas', detalles.listaVarNvas)
                    setTipoVar(detalles.tipoVar)
                    const cantVar = parseInt(detalles.listaVarNvas.length)
                    if (cantVar > 0) {
                        setVariedadesBool(true)
                    } else {
                        setVariedadesBool(false)
                    }
                    let listaTagsAct = []
                    // eslint-disable-next-line
                    detalles.tag.map(tag => {
                        listaTagsAct.push(tag)
                    })
                    let listaimgAct = []
                    // eslint-disable-next-line
                    detalles.image.map(image => {
                        listaimgAct.push(image)
                    })

                    await setListaImgNvas(listaimgAct)
                    setTagsList(listaTagsAct)
                    setRelistar(!relistar)
                    setEsperar2(false)
                } else {
                    setEsperar2(false)
                }
            })
    }

    const ModificarProducto = async (e) => {
        e.preventDefault()
        setEsperar(true)
        const cantimg = parseInt(listaImgNvas.length)
        let listaImgNuevas = []
        if (cantimg > 0) {
            // eslint-disable-next-line
            listaImgNvas.map(link => {
                const protocolo = link[0].substring(0, 4)
                if (protocolo !== "http") {
                    listaImgNuevas.push([link[0], link[1]])
                }
            })
        }

        const cantImagenes = parseInt(listaImgNuevas.length)

        const datos = {
            id: idDetalle,
            name: nombreNvo,
            salePrice: precioVtaNvo,
            shopPrice: precioCpraNvo,
            shortDescr: descrCortaNvo,
            longDescr: descrLargaNvo,
            category: categoriaNvo,
            subCategory: subCatNvo,
            cantMaxSale: cpraMaxNvo,
            listaTags: tagsList,
            cantImg: cantImagenes,
            extrainfohtml: model,
            lisImgBorradas: listaImgEliminadas,
            peso: peso,
            sizeX: sizeX,
            sizeY: sizeY,
            sizeZ: sizeZ,
            listaVarNvas: listaVarNvas,
            tipoVar: tipoVar,
            proveedor: proveedor
        }
        await axios.post(UrlNodeServer.ModificarProducto, datos)
            .then(res => {
                setEsperar(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    if (cantImagenes > 0) {
                        const result = respuesta.result
                        if (result.length > 0) {
                            setCargaImg(true)
                            subirImagenes(result, true, listaImgNuevas)
                        } else {
                            setActividadStr("Hubo un error y no se modificó correctamente el producto!")
                            setMsgGralAlert("")
                            setSuccessAlert(false)
                            setAlertar(!alertar)
                        }
                    } else {
                        setActividadStr("El usuario ha modificado la oferta '" + nombreNvo + "'")
                        setNvaActCall(!nvaActCall)
                        setMsgStrong("Producto modificadas con éxito!")
                        setMsgGralAlert("")
                        setSuccessAlert(true)
                        setAlertar(!alertar)
                        setCall(!call)
                        setNvaOffer(false)
                        setDetallesBool(false)
                        ResetStatesForm()
                    }
                } else {
                    setActividadStr("Hubo un error y no se modificó correctamente el producto!")
                    setMsgGralAlert("")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                }
            })
    }

    const AumentoTG = (e, toggle) => {
        e.preventDefault()
        setAumentoBool(toggle)
    }

    const AumentarPrecios = async (e) => {
        e.preventDefault()
        setEsperar(true)
        const datos = {
            porcentaje: porcAument,
            searchBool: busquedaBool,
            searchItem: palabraBuscada,
            redondear: redondeo
        }

        await axios.post(UrlNodeServer.AumentarPrecios, datos)
            .then(res => {
                setEsperar(false)
                setPorcAument("")
                setAumentoBool(false)
                setCall(!call)
            })

    }

    const DescuentosBtn = (e, toggle) => {
        e.preventDefault()
        setDescuentoTogg(toggle)
    }

    const AplicarDescForm = async (e) => {
        e.preventDefault()
        setEsperar(true)
        const datos = {
            porcentaje: porcAument,
            searchBool: busquedaBool,
            searchItem: palabraBuscada,
            redondear: redondeo,
            vtoDesc: vtoDesc
        }

        await axios.post(UrlNodeServer.AplicarDescuento, datos, {
            headers: {
                'x-access-token': cookie
            }
        })
            .then(res => {
                const status = parseInt(res.data.status)
                if (status === 200) {
                    setMsgStrong("Etiquetas aplicadas con éxito!")
                    setMsgGralAlert("")
                    setSuccessAlert(true)
                    setAlertar(!alertar)
                } else if (status === 301) {
                    setMsgStrong("No tiene los permisos!")
                    setMsgGralAlert(" Apriete CTRL + F5 para refrescar la página.")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                } else {
                    setMsgStrong("Error!")
                    setMsgGralAlert(" Controle que haya productos en el listado.")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                }
                setEsperar(false)
                setPorcAument("")
                setDescuentoTogg(false)
                setCall(!call)
            })
    }

    const EtiquetaGralBtn = (e, toggle) => {
        e.preventDefault()
        setEtiquetaTogg(toggle)
    }

    const AplicarEtiquetaGral = async (e) => {
        e.preventDefault()
        setEsperar(true)
        const datos = {
            etiqueta: etiquetaGral,
            searchBool: busquedaBool,
            searchItem: palabraBuscada
        }

        await axios.post(UrlNodeServer.EtiquetasGral, datos, {
            headers: {
                'x-access-token': cookie
            }
        })
            .then(res => {
                const status = parseInt(res.data.status)
                if (status === 200) {
                    setMsgStrong("Etiquetas aplicadas con éxito!")
                    setMsgGralAlert("")
                    setSuccessAlert(true)
                    setAlertar(!alertar)
                } else if (status === 301) {
                    setMsgStrong("No tiene los permisos!")
                    setMsgGralAlert(" Apriete CTRL + F5 para refrescar la página.")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                } else {
                    setMsgStrong("Error!")
                    setMsgGralAlert(" Controle que haya productos en el listado.")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                }
                setEsperar(false)
                setEtiquetaGral("")
                setEtiquetaTogg(false)
                setCall(!call)
            })
    }

    const QuitarEtiqueta = async (e) => {
        e.preventDefault()
        setEsperar(true)
        const datos = {
            etiqueta: etiquetaGral,
            searchBool: busquedaBool,
            searchItem: palabraBuscada
        }

        await axios.post(UrlNodeServer.QuitarEtiqueta, datos, {
            headers: {
                'x-access-token': cookie
            }
        })
            .then(res => {
                const status = parseInt(res.data.status)
                if (status === 200) {
                    setMsgStrong("Etiquetas removida con éxito!")
                    setMsgGralAlert("")
                    setSuccessAlert(true)
                    setAlertar(!alertar)
                } else if (status === 301) {
                    setMsgStrong("No tiene los permisos!")
                    setMsgGralAlert(" Apriete CTRL + F5 para refrescar la página.")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                } else {
                    setMsgStrong("Error!")
                    setMsgGralAlert(" Controle que haya productos en el listado.")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                }
                setEsperar(false)
                setEtiquetaGral("")
                setEtiquetaTogg(false)
                setCall(!call)
            })
    }

    if (errorT) {
        return (
            <Redirect
                className="text-light"
                to={process.env.PUBLIC_URL + "/"}
            />
        )
    } else {

        return (
            <>
                <AlertaForm
                    success={successAlert}
                    msgStrong={msgStrongAlert}
                    msgGral={msgGralAlert}
                    alertar={alertar}
                />
                <Header />
                <Container className="mt--7" fluid>
                    {
                        esperar ?
                            <div style={{ textAlign: "center", marginTop: "100px" }}>
                                <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div> :
                            cargaImg ?
                                <>
                                    <ProgressBar1
                                        progressImg={progressImg}
                                        titulo="Cargando imagenes al servidor"
                                    />
                                </>
                                :
                                <>
                                    <Row style={
                                        detallesBool ?
                                            { display: "none" } :
                                            nvaOffer ?
                                                { display: "none" } :
                                                { display: "block" }}>
                                        <Col>
                                            <Card className="shadow">
                                                <CardHeader className="border-0">
                                                    <Row>
                                                        <Col>
                                                            <h3 className="mb-0">Lista de Productos</h3>
                                                        </Col>
                                                        <Col style={{ textAlign: "right" }}>
                                                            <BusquedaForm
                                                                busquedaBool={busquedaBool}
                                                                setPalabraBuscada={(palabraBuscada) => setPalabraBuscada(palabraBuscada)}
                                                                palabraBuscada={palabraBuscada}
                                                                setBusquedaBool={(busquedaBool) => setBusquedaBool(busquedaBool)}
                                                                call={call}
                                                                setCall={(call) => setCall(call)}
                                                                tittle="Buscar un producto"
                                                            />
                                                        </Col>
                                                    </Row>

                                                </CardHeader>
                                                {
                                                    loading ?
                                                        <div style={{ textAlign: "center", marginTop: "100px" }}>
                                                            <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div> :
                                                        error ?
                                                            null :
                                                            <>
                                                                <ListadoTable
                                                                    listado={listado}
                                                                    titulos={titulos}
                                                                />
                                                                <CardFooter className="py-4">
                                                                    {
                                                                        etiquetaTogg ?
                                                                            <Form onSubmit={e => AplicarEtiquetaGral(e)}>
                                                                                <Row style={{ marginTop: "30px", marginBottom: "30px" }}>
                                                                                    <Col lg="4">
                                                                                        <FormGroup>
                                                                                            <label
                                                                                                className="form-control-label"
                                                                                                htmlFor="input-email"
                                                                                            >
                                                                                                Etiqueta para agregar (Se aplica a la lista filtrada)
                                                                                            </label>
                                                                                            <Input
                                                                                                className="form-control-alternative"
                                                                                                id="input-email"
                                                                                                placeholder="Etiqueta..."
                                                                                                type="text"
                                                                                                value={etiquetaGral}
                                                                                                onChange={e => setEtiquetaGral(e.target.value)}
                                                                                                required
                                                                                            />
                                                                                        </FormGroup>
                                                                                    </Col>
                                                                                    <Col lg="3" style={{ textAlign: "left", marginTop: "30px" }}>
                                                                                        <button
                                                                                            className="btn btn-primary"
                                                                                            style={{ width: "150px", margin: "0.5rem" }}
                                                                                            type="submit"
                                                                                        >
                                                                                            Agregar
                                                                                        </button>
                                                                                        <button
                                                                                            className="btn btn-danger"
                                                                                            style={{ width: "150px", margin: "0.5rem" }}
                                                                                            onClick={e => EtiquetaGralBtn(e, false)}
                                                                                        >
                                                                                            Cancelar
                                                                                        </button>
                                                                                    </Col>
                                                                                    <Col lg="3" style={{ textAlign: "left", marginTop: "30px" }}>
                                                                                        <button
                                                                                            className="btn btn-warning"
                                                                                            style={{ width: "150px" }}
                                                                                            onClick={e => QuitarEtiqueta(e)}
                                                                                        >
                                                                                            Quitar Etiqueta
                                                                                        </button>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Form>
                                                                            :
                                                                            descuentoTogg ?
                                                                                <Form onSubmit={e => AplicarDescForm(e)}>
                                                                                    <Row style={{ marginTop: "30px", marginBottom: "30px" }}>
                                                                                        <Col lg="4">
                                                                                            <Row>
                                                                                                <FormGroup>
                                                                                                    <label
                                                                                                        className="form-control-label"
                                                                                                        htmlFor="input-email"
                                                                                                    >
                                                                                                        Porcentaje del descuento (Se aplica a la lista filtrada)
                                                                                                </label>
                                                                                                    <Input
                                                                                                        className="form-control-alternative"
                                                                                                        id="input-email"
                                                                                                        placeholder="Porcentaje..."
                                                                                                        type="number"
                                                                                                        value={porcAument}
                                                                                                        onChange={e => setPorcAument(e.target.value)}
                                                                                                        min={1}
                                                                                                        max={100}
                                                                                                        step={1}
                                                                                                        required
                                                                                                    />
                                                                                                </FormGroup>
                                                                                            </Row>
                                                                                            <Row>
                                                                                                <FormGroup>
                                                                                                    <label
                                                                                                        className="form-control-label"
                                                                                                        htmlFor="input-email"
                                                                                                    >
                                                                                                        Vencimiento del descuento
                                                                                                </label>
                                                                                                    <Input
                                                                                                        className="form-control-alternative"
                                                                                                        id="input-email"
                                                                                                        placeholder="Porcentaje..."
                                                                                                        type="date"
                                                                                                        value={vtoDesc}
                                                                                                        onChange={e => setVtoDesc(e.target.value)}
                                                                                                        min={minDate}
                                                                                                        required
                                                                                                    />
                                                                                                </FormGroup>
                                                                                            </Row>
                                                                                        </Col>
                                                                                        <Col lg="2">
                                                                                            <FormGroup check style={{ marginTop: "45px" }}>
                                                                                                <Label check>
                                                                                                    <Input
                                                                                                        onChange={e => setRedondeo(e.target.checked)}
                                                                                                        checked={redondeo}
                                                                                                        type="checkbox" />{' '}
                                                                                                        Redondear
                                                                                            </Label>
                                                                                            </FormGroup>
                                                                                        </Col>
                                                                                        <Col lg="3" style={{ textAlign: "left", marginTop: "30px" }}>
                                                                                            <button
                                                                                                className="btn btn-primary"
                                                                                                style={{ width: "150px", margin: "0.5rem" }}
                                                                                                type="submit"
                                                                                            >
                                                                                                Aplicar
                                                                                            </button>
                                                                                            <button
                                                                                                className="btn btn-danger"
                                                                                                style={{ width: "150px", margin: "0.5rem" }}
                                                                                                onClick={e => DescuentosBtn(e, false)}
                                                                                            >
                                                                                                Cancelar
                                                                                            </button>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Form>
                                                                                :
                                                                                aumentoBool ?
                                                                                    <Form onSubmit={e => AumentarPrecios(e)}>
                                                                                        <Row style={{ marginTop: "30px", marginBottom: "30px" }}>
                                                                                            <Col lg="4">
                                                                                                <FormGroup>
                                                                                                    <label
                                                                                                        className="form-control-label"
                                                                                                        htmlFor="input-email"
                                                                                                    >
                                                                                                        Porcentaje a Aumentar (Se aplica a la lista filtrada)
                                                                                                    </label>
                                                                                                    <Input
                                                                                                        className="form-control-alternative"
                                                                                                        id="input-email"
                                                                                                        placeholder="Porcentaje..."
                                                                                                        type="number"
                                                                                                        value={porcAument}
                                                                                                        onChange={e => setPorcAument(e.target.value)}
                                                                                                        min={1}
                                                                                                        max={100}
                                                                                                        step={1}
                                                                                                        required
                                                                                                    />
                                                                                                </FormGroup>
                                                                                            </Col>
                                                                                            <Col lg="2">
                                                                                                <FormGroup check style={{ marginTop: "45px" }}>
                                                                                                    <Label check>
                                                                                                        <Input
                                                                                                            onChange={e => setRedondeo(e.target.checked)}
                                                                                                            checked={redondeo}
                                                                                                            type="checkbox" />{' '}
                                                                                                            Redondear
                                                                                            </Label>
                                                                                                </FormGroup>
                                                                                            </Col>
                                                                                            <Col lg="3" style={{ textAlign: "left", marginTop: "30px" }}>
                                                                                                <button
                                                                                                    className="btn btn-primary"
                                                                                                    style={{ width: "150px", margin: "0.5rem" }}
                                                                                                    type="submit"
                                                                                                >
                                                                                                    Aplicar
                                                                                                </button>
                                                                                                <button
                                                                                                    className="btn btn-danger"
                                                                                                    style={{ width: "150px", margin: "0.5rem" }}
                                                                                                    onClick={e => AumentoTG(e, false)}
                                                                                                >
                                                                                                    Cancelar
                                                                                                </button>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </Form>
                                                                                    :
                                                                                    <nav aria-label="..." style={{ marginBottom: "20px" }}>
                                                                                        <Col lg="8" style={{ marginTop: "30px" }}>
                                                                                            <Row>
                                                                                                <Col sm="6" style={{ marginTop: "20px" }}>
                                                                                                    <button
                                                                                                        className="btn btn-primary"
                                                                                                        style={nvaOffer ? { display: "none", width: "200px" } : { display: "block", width: "200px" }}
                                                                                                        onClick={e => NvaOferta(e)}
                                                                                                    >
                                                                                                        Nuevo Producto
                                                                                                    </button>
                                                                                                </Col>
                                                                                                <Col sm="6" style={{ textAlign: "left", marginTop: "20px" }}>
                                                                                                    <button
                                                                                                        className="btn btn-primary"
                                                                                                        style={nvaOffer ? { display: "none", width: "200px" } : { display: "block", width: "200px" }}
                                                                                                        onClick={e => AumentoTG(e, true)}
                                                                                                    >
                                                                                                        Aumentar Precios
                                                                                                    </button>
                                                                                                </Col>
                                                                                            </Row>
                                                                                            <Row>
                                                                                                <Col sm="6" style={{ textAlign: "left", marginTop: "20px" }}>
                                                                                                    <button
                                                                                                        className="btn btn-primary"
                                                                                                        style={nvaOffer ? { display: "none", width: "200px" } : { display: "block", width: "200px" }}
                                                                                                        onClick={e => DescuentosBtn(e, true)}
                                                                                                    >
                                                                                                        Aplicar Descuento
                                                                                                    </button>
                                                                                                </Col>
                                                                                                <Col sm="6" style={{ textAlign: "left", marginTop: "20px" }}>
                                                                                                    <button
                                                                                                        className="btn btn-primary"
                                                                                                        style={nvaOffer ? { display: "none", width: "200px" } : { display: "block", width: "200px" }}
                                                                                                        onClick={e => EtiquetaGralBtn(e, true)}
                                                                                                    >
                                                                                                        Aplicar Etiqueta
                                                                                                    </button>
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </Col>
                                                                                    </nav>
                                                                    }

                                                                    <Paginacion
                                                                        setPagina={(pagina) => setPagina(pagina)}
                                                                        setCall={(call) => setCall(call)}
                                                                        pagina={pagina}
                                                                        call={call}
                                                                        plantPaginas={plantPaginas}
                                                                        ultimaPag={ultimaPag}
                                                                        data={data}
                                                                        setPlantPaginas={(plantPaginas) => setPlantPaginas(plantPaginas)}
                                                                        setUltimaPag={(ultimaPag) => setUltimaPag(ultimaPag)}
                                                                    />
                                                                </CardFooter>
                                                            </>
                                                }
                                            </Card>
                                        </Col>
                                    </Row>

                                    <Row style={
                                        detallesBool ?
                                            { display: "block", marginTop: "25px" } :
                                            !nvaOffer ?
                                                { display: "none", marginTop: "25px" } :
                                                { display: "block", marginTop: "25px" }} >
                                        <Col className="order-xl-1" lg="12">
                                            <Card className="bg-secondary shadow">
                                                <CardHeader className="bg-white border-0">
                                                    <Row className="align-items-center">
                                                        <Col xs="9">
                                                            {
                                                                detallesBool ?
                                                                    <h3 className="mb-0">{nombreNvo}</h3> :
                                                                    <h3 className="mb-0">Nuevo Producto</h3>
                                                            }

                                                        </Col>
                                                        <Col xs="3" style={{ textAlign: "right" }}>
                                                            <button
                                                                className="btn btn-danger"
                                                                onClick={e => CancelaNvoOff(e)}
                                                            > x
                                                            </button>
                                                        </Col>
                                                    </Row>
                                                </CardHeader>
                                                <CardBody>
                                                    <Form onSubmit={detallesBool ? e => ModificarProducto(e) : e => NvoProducto(e)}>
                                                        <h6 className="heading-small text-muted mb-4">
                                                            Información del Producto
                                                        </h6>
                                                        {
                                                            esperar2 ?
                                                                <div style={{ textAlign: "center", marginTop: "100px" }}>
                                                                    <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div> :
                                                                <>
                                                                    <div className="pl-lg-4">
                                                                        <InfoForm
                                                                            nombreNvo={nombreNvo}
                                                                            setNombreNvo={(nombreNvo) => setNombreNvo(nombreNvo)}
                                                                            precioVtaNvo={precioVtaNvo}
                                                                            setPrecioVtaNvo={(precioVtaNvo) => setPrecioVtaNvo(precioVtaNvo)}
                                                                            precioCpraNvo={precioCpraNvo}
                                                                            setPrecioCpraNvo={(precioCpraNvo) => setPrecioCpraNvo(precioCpraNvo)}
                                                                            cpraMaxNvo={cpraMaxNvo}
                                                                            setCpraMaxNvo={(cpraMaxNvo) => setCpraMaxNvo(cpraMaxNvo)}
                                                                            descrCortaNvo={descrCortaNvo}
                                                                            setDescrCortaNvo={(descrCortaNvo) => setDescrCortaNvo(descrCortaNvo)}
                                                                            descrLargaNvo={descrLargaNvo}
                                                                            setDescrLargaNvo={(descrLargaNvo) => setDescrLargaNvo(descrLargaNvo)}
                                                                            peso={peso}
                                                                            setPeso={setPeso}
                                                                            sizeX={sizeX}
                                                                            setSizeX={setSizeX}
                                                                            sizeY={sizeY}
                                                                            setSizeY={setSizeY}
                                                                            sizeZ={sizeZ}
                                                                            setSizeZ={setSizeZ}
                                                                            listaVarNvas={listaVarNvas}
                                                                            setListaVarNvas={setListaVarNvas}
                                                                            variedadesBool={variedadesBool}
                                                                            setVariedadesBool={setVariedadesBool}
                                                                            tipoVar={tipoVar}
                                                                            setTipoVar={setTipoVar}
                                                                        />
                                                                        <Row>
                                                                            <hr className="my-4" />
                                                                            <CategoriasForm
                                                                                categoriaNvo={categoriaNvo}
                                                                                setCategoriaNvo={(categoriaNvo) => setCategoriaNvo(categoriaNvo)}
                                                                                plantCat={plantCat}
                                                                                setPlantCat={(plantCat) => setPlantCat(plantCat)}
                                                                                listaCat={listaCat}
                                                                                setListaCat={(listaCat) => setListaCat(listaCat)}
                                                                            />

                                                                            <SubCAtegoriasForm
                                                                                subCatNvo={subCatNvo}
                                                                                setSubCatNvo={(subCatNvo) => setSubCatNvo(subCatNvo)}
                                                                                setPlantSubCat={(plantSubCat) => setPlantSubCat(plantSubCat)}
                                                                                plantSubCat={plantSubCat}
                                                                                listaSubCat={listaSubCat}
                                                                                setListaSubCat={(listaSubCat) => setListaSubCat(listaSubCat)}
                                                                            />
                                                                        </Row>
                                                                    </div>
                                                                    <hr className="my-4" />
                                                                    <div className="pl-lg-4">

                                                                        <TagsForm
                                                                            tagNvo={tagNvo}
                                                                            setTagNvo={setTagNvo}
                                                                            setModalListaTags={setModalListaTags}
                                                                            modalListaTags={modalListaTags}
                                                                            tagsPlant={tagsPlant}
                                                                            setTagsPlant={setTagsPlant}
                                                                            tagsList={tagsList}
                                                                            setTagsList={setTagsList}
                                                                            plantTags={plantTags}
                                                                            setPlantTags={setPlantTags}
                                                                            listadoTags={listadoTags}
                                                                            setListadoTags={setListadoTags}
                                                                            relistar={relistar}
                                                                            setRelistar={setRelistar}
                                                                        />
                                                                    </div>
                                                                    <hr className="my-4" />
                                                                    <div className="pl-lg-4">
                                                                        <ProveedoresForm
                                                                            proveedor={proveedor}
                                                                            setProveedor={setProveedor}
                                                                            listaProveedores={listaProveedores}
                                                                            setListaProveedores={setListaProveedores}
                                                                        />
                                                                    </div>
                                                                    <hr className="my-4" />
                                                                    {/* Address */}
                                                                    <h6 className="heading-small text-muted mb-4">
                                                                        Imagenes del producto
                                                                    </h6>

                                                                    <ImagenesForm
                                                                        listaImgNvas={listaImgNvas}
                                                                        setListaImgNvas={(listaImgNvas) => setListaImgNvas(listaImgNvas)}
                                                                        plantNvasImg={plantNvasImg}
                                                                        setPlantNvasImg={setPlantNvasImg}
                                                                        detallesBool={detallesBool}
                                                                        listaImgEliminadas={listaImgEliminadas}
                                                                        setListaImgEliminadas={setListaImgEliminadas}
                                                                        nvaOffer={nvaOffer}
                                                                        copiarDet={copiarDet}
                                                                        setCopiarDet={setCopiarDet}
                                                                    />
                                                                </>
                                                        }

                                                        <Row style={{ marginTop: "15px" }}>
                                                            <Col lg="12" style={{ textAlign: "center" }}>
                                                                <FormGroup>
                                                                    <button
                                                                        className="btn btn-warning"
                                                                        type="submit"
                                                                    >
                                                                        {
                                                                            detallesBool ?
                                                                                "Aplicar Cambios" :
                                                                                "Agregar Nuevo Producto"
                                                                        }
                                                                    </button>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                    </Form>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </>
                    }
                </Container>
            </>
        )
    }
}

export default ProductsItems;
