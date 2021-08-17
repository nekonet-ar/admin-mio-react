import React, { useState } from 'react'
import {
    Row,
    Card,
    CardBody,
    CardHeader,
    Nav,
    NavItem,
    NavLink,
    Col
} from "reactstrap";
import { Line } from "react-chartjs-2"
import classnames from "classnames"
import {
    chartOptions,
    parseOptions
} from "variables/charts.js"
import Chart from "chart.js"

const GrafCurva = ({ labels1, data1, longLabBool1, longLabels1, labels2, data2, longLabBool2, longLabels2, titulo, tipoRes1, tipoRes2 }) => {
    const [activeNav, setActiveNav] = useState(1);
    const [chartExample1Data, setChartExample1Data] = useState("data1");

    if (window.Chart) {
        parseOptions(Chart, chartOptions());
    }

    const toggleNavs = (e, index) => {
        e.preventDefault();
        setActiveNav(index);
        setChartExample1Data("data" + index);
    };

    var colors = {
        gray: {
            100: "#f6f9fc",
            200: "#e9ecef",
            300: "#dee2e6",
            400: "#ced4da",
            500: "#adb5bd",
            600: "#8898aa",
            700: "#525f7f",
            800: "#32325d",
            900: "#212529"
        },
        theme: {
            default: "#172b4d",
            primary: "#5e72e4",
            secondary: "#f4f5f7",
            info: "#11cdef",
            success: "#2dce89",
            danger: "#f5365c",
            warning: "#fb6340"
        },
        black: "#12263F",
        white: "#FFFFFF",
        transparent: "transparent"
    };

    let chartExample5 = {
        options: {
            scales: {
                yAxes: [
                    {
                        gridLines: {
                            color: colors.gray[900],
                            zeroLineColor: colors.gray[900]
                        },
                        ticks: {
                            callback: function (value) {
                                if (!(value % 10)) {
                                    return value;
                                }
                            }
                        }
                    }
                ]
            },
            tooltips: {
                callbacks: {
                    label: function (item, data) {
                        var label = data.datasets[item.datasetIndex].label || "";
                        var yLabel = item.yLabel;
                        var content = "";

                        if (data.datasets.length > 1) {
                            content += label;
                        }

                        content += yLabel;
                        return content;
                    }
                }
            }
        },
        data1: canvas => {
            return {
                labels: labels1,
                datasets: [
                    {
                        label: "Meses",
                        data: data1
                    }
                ]
            };
        },
        data2: canvas => {
            return {
                labels: labels2,
                datasets: [
                    {
                        label: "Semana",
                        data: data2
                    }
                ]
            };
        }
    };

    return (
        <Card className="bg-gradient-default shadow">
            <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                    <div className="col">
                        <h2 className="text-white mb-0">{titulo}</h2>
                    </div>
                    <div className="col">
                        <Nav className="justify-content-end" pills>
                            <NavItem>
                                <NavLink
                                    className={classnames("py-2 px-3", {
                                        active: activeNav === 1,
                                    })}
                                    href="#pablo"
                                    onClick={(e) => toggleNavs(e, 1)}
                                >
                                    <span className="d-none d-md-block">{tipoRes1[0]}</span>
                                    <span className="d-md-none">{tipoRes1[1]}</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames("py-2 px-3", {
                                        active: activeNav === 2,
                                    })}
                                    data-toggle="tab"
                                    href="#pablo"
                                    onClick={(e) => toggleNavs(e, 2)}
                                >
                                    <span className="d-none d-md-block">{tipoRes2[0]}</span>
                                    <span className="d-md-none">{tipoRes2[1]}</span>
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </div>
                </Row>
                <Row>
                    {
                        activeNav === 1 ?

                            longLabBool1 ?
                                longLabels1.map((item, key) => {
                                    return (
                                        <Col md="4" key={key}>
                                            <h4 className="text-primary mb-0">{labels1[key]}: {item}</h4>
                                        </Col>
                                    )
                                }) :
                                null
                            :

                            longLabBool2 ?
                                longLabels2.map((item, key) => {
                                    return (
                                        <Col md="4" key={key}>
                                            <h4 className="text-primary mb-0">{labels2[key]}: {item}</h4>
                                        </Col>
                                    )
                                }) :
                                null
                    }

                </Row>
            </CardHeader>
            <CardBody>
                {/* Chart */}
                <div className="chart">
                    <Line
                        data={chartExample5[chartExample1Data]}
                        options={chartExample5.options}
                        getDatasetAtEvent={(e) => console.log(e)}
                    />
                </div>
            </CardBody>
        </Card>
    )
}

export default GrafCurva