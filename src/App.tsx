import React, {createRef} from 'react';
import logo from './logo.svg';
import './App.css';
import Blob from "./components/Blob";

interface AppState {
    pointX: number;
    pointY: number;
}

const width = 600;
const height = 600;

class App extends React.Component<{}, AppState> {

    svg: any;

    constructor(props: any) {
        super(props);
        this.state = {
            pointX: width/2,
            pointY: height/2
        };
        this.svg = createRef();
    }

    getRandomNumber(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    mag(x: number, y: number) {
        return Math.sqrt(x*x + y*y);
    };

    normalize(x: number, y: number): {x: number, y: number}{
        let m = this.mag(x, y);
        if (m > 0) {
            m = m/2;
            return {x: x/m, y: y/m};
        } else {
            return {x: x, y: y}
        }
    };

    updatePosition(pt: any){
        const loc = pt.matrixTransform(this.svg.current.getScreenCTM().inverse());
        const normalized = this.normalize(loc.x-width/2, loc.y-height/2);
        this.setState({pointX: this.state.pointX + normalized.x, pointY: this.state.pointY + normalized.y});
    }

    componentDidMount() {
        this.setPositionUpdater();
    }

    setPositionUpdater(){
        let pt = this.svg.current.createSVGPoint();
        document.onmousemove = (e) => {
            pt.x = e.clientX; pt.y = e.clientY;
        };
        setInterval(() => this.updatePosition(pt), 20);
    }

    render() {
        let blobs = [];
        for (let i = 0; i < 10; ++i) {
            blobs.push(<Blob x={this.getRandomNumber(0, width)} y={this.getRandomNumber(0, height)} r={10} key={i}/>)
        }

        return (
            <div className="App">
                {/*   <header className="App-header">
              <img src={logo} className="App-logo" alt="logo"/>
              <h1 className="App-title">Flappy Bird (SVG + React)</h1>
          </header>*/}
                <p className="App-intro"/>
                <svg  ref={this.svg} style={{backgroundColor: 'black'}} width={width} height={height}>
                    <g transform={`translate(${width/2-this.state.pointX}, ${height/2-this.state.pointY})`}>
                    <Blob x={this.state.pointX} y={this.state.pointY} r={50}/>
                    <circle cx={10} cy={100} r={10} fill={"white"}/>
                    <circle cx={50} cy={300} r={10} fill={"white"}/>
                    <circle cx={100} cy={400} r={10} fill={"white"}/>
                    <circle cx={200} cy={500} r={10} fill={"white"}/>
                    </g>
                </svg>
            </div>
        );
    }
};

export default App;
