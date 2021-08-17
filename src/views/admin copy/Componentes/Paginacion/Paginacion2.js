import React, { useEffect } from 'react'
import {
    Pagination,
    PaginationItem,
    PaginationLink,
} from "reactstrap"

const Paginacion = ({
    plantPaginas,
    setPlantPaginas,
    ultimaPag,
    setUltimaPag,
    pagina,
    setPagina,
    totalPag,
    cantTotal
}) => {

    useEffect(() => {
        ListarPaginas()
        // eslint-disable-next-line
    }, [pagina, ultimaPag])

    const PagePrev = (e) => {
        e.preventDefault()
        if (pagina > 1) {
            setPagina(1)
        }
    }

    const PageNetx = (e) => {
        e.preventDefault()
        if (ultimaPag > pagina) {
            setPagina(ultimaPag)
        }
    }

    const ChangePage = (e, page) => {
        e.preventDefault()
        if (page !== pagina) {
            setPagina(page)
        }
    }

    const ListarPaginas = () => {

        if (totalPag) {
            setUltimaPag(totalPag)
            setPlantPaginas(
                cantTotal.map((paginaList, key) => {
                    return (
                        <PaginationItem className={pagina === paginaList ? "active" : ""} key={key}>
                            <PaginationLink
                                href="#x"
                                onClick={e => ChangePage(e, paginaList)}
                            >
                                {paginaList}
                            </PaginationLink>
                        </PaginationItem>
                    )
                })
            )
        }
    }

    return (
        <>
            <nav aria-label="...">
                <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                >
                    <PaginationItem className={pagina === 1 ? "disabled" : ""}>
                        <PaginationLink
                            href="#pablo"
                            onClick={e => PagePrev(e)}
                            tabIndex="-1"
                        >
                            <i className="fas fa-angle-double-left" />
                            <span className="sr-only">Primero</span>
                        </PaginationLink>
                    </PaginationItem>

                    {plantPaginas}

                    <PaginationItem className={pagina === ultimaPag ? "disabled" : ""}>
                        <PaginationLink
                            href="#pablo"
                            onClick={e => PageNetx(e)}
                        >
                            <i className="fas fa-angle-double-right" />
                            <span className="sr-only">Último</span>
                        </PaginationLink>
                    </PaginationItem>
                </Pagination>
            </nav>
        </>
    )
}

export default Paginacion