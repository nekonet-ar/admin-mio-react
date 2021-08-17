import React from 'react'
import {
    Row,
    Col,
    Card,
    CardBody,
    CardHeader
} from "reactstrap";
import { Bar } from "react-chartjs-2"
const GrafBarrasVert = ({ labels, data, longLabBool, longLabels, titulo }) => {
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

    let chartExample6 = {
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
                                    //return '$' + value + 'k'
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
        data: {
            labels: labels,
            datasets: [
                {
                    label: "",
                    data: data,
                    maxBarThickness: 10
                }
            ]
        }
    };

    return (
        <Card className="bg-gradient-default shadow">
            <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                    <div className="col">
                        <div className="col">
                            <h2 className="text-white mb-0">{titulo}</h2>
                        </div>
                    </div>
                </Row>
                <Row>
                    {
                        longLabBool ?
                            longLabels.map((item, key) => {
                                return (
                                    <Col md="4" key={key}>
                                        <h4 className="text-primary mb-0">{labels[key]}: {item}</h4>
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
                    <Bar
                        data={chartExample6.data}
                        options={chartExample6.options}
                    />
                </div>
            </CardBody>
        </Card>
    )
}

export default GrafBarrasVert