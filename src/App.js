import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import { Ciudades } from './ejercicios/ciudades'

class FormSequence extends React.Component {
  constructor() {
    super();
    this.state = {
      actualValue: "",
      sequence: "",
      result: "",
      mode: false
    }
  }
  handleChangeEntry1 = (event) => {
    this.setState({ actualValue: event.target.value });
  }
  handleChangeEntry2 = (event) => {
    this.setState({ sequence: event.target.value });
  }
  ResolverSecuencia = () => {
    let results = "";
    console.log("state", this.state.sequence);
    this.state.sequence.split(" ").forEach(element => {
      results += "Para " + element + " - " + this.ObtenerNumeroCombinaciones(parseInt(element)) + "\n";
    });
    this.setState({ result: results });
  }

  ObtenerNumeroCombinaciones = (length) => {
    return this.bricksTable(length);
    //return this.bricks(length);
    //return this.recursiveBrick(0, length, 0);
  }
  //descartado por ser aun mas lento
  recursiveBrick = (start, end, count) => {
    if (start === end) {
      return 1;
    }
    if (start > end) {
      return 0;
    }
    count = count + this.recursiveBrick(start + 1, end, 0);
    count = count + this.recursiveBrick(start + 2, end, 0);
    return count;
  }
  //descartado por lento
  bricks = (length) => {
    if (length <= 2) {
      return length
    }
    return this.bricks(length - 1) + this.bricks(length - 2);
  }
  ///------Solución final-------------
  bricksTable = (length) => {
    const tabla = [0, 1, 2];
    for (let i = 3; i <= length; i++) {
      tabla[i] = tabla[i - 1] + tabla[i - 2];
    }
    return tabla[length];
  }

  enterEntry = (event) => {
    if (event.key === 'Enter') {
      if (parseInt(this.state.actualValue) === 0) {
        this.ResolverSecuencia();
      } else {
        this.setState({
          sequence: this.state.sequence + " " + this.state.actualValue,
          actualValue: ""
        });

      }
    }
  }

  render() {
    return (
      <div>
        <label>Intruduzca la secuencia.</label>
        <div>
          <Button onClick={() => {
            if (this.state.mode) {
              this.setState({
                mode: false
              });
            } else {
              this.setState({
                mode: true
              });
            }

          }}>Modo de entrada {this.state.mode ? "1 a 1" : "Secuencia"}
          </Button>
        </div>
        {this.state.mode && <div className="input-group">
          <input value={this.state.sequence} onChange={this.handleChangeEntry2}></input>
          <Button onClick={() => this.ResolverSecuencia()}>Resolver Secuencia</Button>
        </div>}
        {!this.state.mode &&
          <div>
            <input value={this.state.actualValue} onChange={this.handleChangeEntry1} onKeyPress={this.enterEntry}></input>
          </div>
        }
        <div>
          {this.state.result.split("\n").map((i, key) => {
            return <div key={key}>
              <label>{i}</label>
            </div>
          })}
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Ciudades></Ciudades>
      </header>
    </div>
  );
}




export default App;
