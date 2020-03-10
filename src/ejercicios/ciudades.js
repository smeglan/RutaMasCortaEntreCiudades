import React from 'react';
import { Button } from 'react-bootstrap';
const file = require('../assets/input.txt')

export class Ciudades extends React.Component {

    constructor() {
        super();
        this.state = {
            nodes: '',
            path: ''
        }
    }
    componentDidMount(){
        this.readFile(file);
    }
    readFile = (file) => {
        const ciudades = [];
        fetch(file)
            .then((r) => r.text())
            .then(text => {
                text.split('\r\n').forEach(element => {
                    const splited = element.split(',');
                    this.setState({ nodes: this.state.nodes + element + '\n' })
                    ciudades.push(splited)
                });
                this.createGraph(ciudades);
            });

    }

    createGraph = (ciudades) => {
        const dataMatriz = this.getListCiudades(ciudades);
        const origen = dataMatriz[0][ciudades[ciudades.length - 1][0]];
        const destino = dataMatriz[0][ciudades[ciudades.length - 1][1]];
        const matrices = this.inicializarMatriz(ciudades, dataMatriz[0], dataMatriz[1]);
        let matrizAdyacencia = matrices[0];
        let caminos = matrices[1];
        for (let k = 0; k < dataMatriz[1]; k++) {
            for (let i = 0; i < dataMatriz[1]; i++) {
                for (let j = 0; j < dataMatriz[1]; j++) {
                    let dt = matrizAdyacencia[i][k] + matrizAdyacencia[k][j];
                    if (matrizAdyacencia[i][j] > dt) {
                        matrizAdyacencia[i][j] = dt;
                        caminos[i][j] = caminos[i][k];
                    }
                }
            }
        }
        this.setState({path:this.getPath(origen, destino, caminos, dataMatriz[2])})
    }

    getListCiudades = (ciudades) => {
        const nameCiudades = {}
        const swapCiudades = {}
        let count = 0;
        for (let i = 0; i < ciudades.length - 1; i++) {
            if (nameCiudades[ciudades[i][0]] === undefined) {
                nameCiudades[ciudades[i][0]] = count;
                swapCiudades[count] = [ciudades[i][0]];
                count++;
            }
            if (nameCiudades[ciudades[i][1]] === undefined) {
                nameCiudades[ciudades[i][1]] = count;
                swapCiudades[count] = [ciudades[i][1]];
                count++;
            }
        }
        const data = [nameCiudades, count, swapCiudades]
        return data;
    }

    getPath = (origin, end, matrix, swapCiudades) => {
        let path = [];
        let current = origin;
        path.push(swapCiudades[origin]);
        while (current !== end) {
            path.push(' - '+swapCiudades[matrix[current][end]]);
            current = matrix[current][end];
            console.log(current);
        }
        return path;
    }

    inicializarMatriz = (ciudades, names, length) => {
        let matriz = [];
        let matriz2 = [];
        for (let i = 0; i < length; i++) {
            matriz.push([]);
            matriz2.push([]);
            for (let j = 0; j < length; j++) {
                if (i === j) {
                    matriz[i].push(0);
                    matriz2[i].push('-');
                } else {
                    matriz[i].push(Number.POSITIVE_INFINITY);
                    matriz2[i].push(-1);
                }
            }
        }
        for (let i = 0; i < ciudades.length - 1; i++) {
            if (matriz[names[ciudades[i][0]]][names[ciudades[i][1]]] > ciudades[i][2]) {
                matriz[names[ciudades[i][0]]][names[ciudades[i][1]]] = parseInt(ciudades[i][2]);
                matriz[names[ciudades[i][1]]][names[ciudades[i][0]]] = parseInt(ciudades[i][2]);
                matriz2[names[ciudades[i][0]]][names[ciudades[i][1]]] = names[ciudades[i][1]];
                matriz2[names[ciudades[i][1]]][names[ciudades[i][0]]] = names[ciudades[i][0]];
            }
        }
        //console.log('matriz2', matriz);
        const matrices = [matriz, matriz2];
        return matrices;
    }

    render() {
        return (
            <div>
                <div>
                    <label>----Archivo----</label>
                    {this.state.nodes.split("\n").map((i, key) => {
                        return <div key={key}>
                            <label>{i}</label>
                        </div>
                    })}
                </div>
                <label>Respuesta: {this.state.path}</label>
            </div>
        );
    }
}