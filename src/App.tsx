import React, {createRef} from 'react';
import './App.css';
import Blob from "./components/Blob";

interface Position {
    x: number,
    y: number,
    id: number
}

interface AppState {
    pointX: number,
    pointY: number,
    r: number,
    blobsPositions: Position[]
}

const width = window.innerWidth;
const height = window.innerHeight;

class App extends React.Component<{}, AppState> {

    svg: any;

    constructor(props: any) {
        super(props);
        this.state = {
            pointX: 0,
            pointY: 0,
            r: 50,
            blobsPositions: this.getRandomPos()
        };
        this.svg = createRef();
    }

    getRandomNumber(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    mag(x: number, y: number) {
        return Math.sqrt(x * x + y * y);
    };

    normalize(x: number, y: number): { x: number, y: number } {
        let m = this.mag(x, y);
        if (m > 0) {
            m = m / 2;
            return {x: x / m, y: y / m};
        } else {
            return {x: x, y: y}
        }
    };

    updatePosition(pt: any) {
        const loc = pt.matrixTransform(this.svg.current.getScreenCTM().inverse());
        const normalized = this.normalize(loc.x - width / 2, loc.y - height / 2);
        this.setState({pointX: this.state.pointX + normalized.x, pointY: this.state.pointY + normalized.y});
    }

    componentDidMount() {
        this.setPositionUpdater();
    }

    getRandomPos() {
        let blobs = [];
        for (let i = 0; i < 100; ++i) {
            blobs.push({x: this.getRandomNumber(-width, width), y: this.getRandomNumber(-height, height), id: i});
        }
        return blobs;
    }

    setPositionUpdater() {
        let pt = this.svg.current.createSVGPoint();
        document.onmousemove = (e) => {
            pt.x = e.clientX;
            pt.y = e.clientY;
        };
        document.ontouchmove = (e) => {
            pt.x = e.touches[0].clientX;
            pt.y = e.touches[0].clientY;
        };
        setInterval(() => this.updatePosition(pt), 20);
    }

    eats(other: Position) {
        const d = Math.sqrt((this.state.pointX - other.x) * (this.state.pointX - other.x) + (this.state.pointY - other.y) * (this.state.pointY - other.y));
        if (d < this.state.r + 10) {
            const sum = Math.PI * this.state.r * this.state.r + Math.PI * 10 * 10;
            this.setState({r: Math.sqrt(sum / Math.PI)});
            return true;
        } else {
            return false;
        }
    }

    render() {

        const fullScreen = {
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'black'
        } as React.CSSProperties;

        const transition = {
            transition: "all 0.5s ease-in-out",
            WebkitTransition: "all 0.5s ease-in-out",
            MozTransition: "all 0.5s ease-in-out",
            OTransition: "all 0.5s ease-in-out"
        };

        return (
            <div className="App">
                <svg style={fullScreen} ref={this.svg} width={width} height={height}>
                    <g style={transition}
                       transform={`translate(${width / 2}, ${height / 2}), scale(${50 / this.state.r})`}>
                        <g transform={`translate(${-this.state.pointX}, ${-this.state.pointY})`}>
                            <Blob x={this.state.pointX} y={this.state.pointY} r={this.state.r}/>
                            {this.state.blobsPositions.map((pos: Position, index: number) => {
                                if (this.eats(pos)) {
                                    const blobs = this.state.blobsPositions;
                                    blobs.splice(index, 1);
                                    this.setState({blobsPositions: blobs});
                                }
                                return <Blob x={pos.x} y={pos.y} r={10} key={index}/>
                            })}
                        </g>
                    </g>
                </svg>
            </div>
        );
    }
};

export default App;
