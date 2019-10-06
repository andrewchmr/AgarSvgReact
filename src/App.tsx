import React, {createRef, RefObject} from 'react';
import './App.css';
import Blob from "./components/Blob";
import {BlobData, getMagnitude, getRandomPos, normalize} from "./utils";

interface AppState {
    mainBlob: BlobData,
    blobsPositions: BlobData[]
}

const width = window.innerWidth;
const height = window.innerHeight;
const initialSizeMainBlob = 50;

class App extends React.Component<{}, AppState> {
    svg: RefObject<SVGSVGElement>;

    constructor(props: any) {
        super(props);
        this.state = {
            mainBlob: {
                position: {
                    x: 0,
                    y: 0
                },
                r: initialSizeMainBlob,
                id: 0
            },
            blobsPositions: getRandomPos(width, height, initialSizeMainBlob)
        };
        this.svg = createRef();
    }

    componentDidMount() {
        this.setPositionUpdater();
    }

    componentDidUpdate() {
        this.state.blobsPositions.forEach((pos: BlobData, index: number) => {
            if (this.eats(pos)) {
                const blobs = this.state.blobsPositions;
                blobs.splice(index, 1);
                this.setState({blobsPositions: blobs});
            }
        });
    }

    updatePosition(pt: DOMPoint): void {
        const {mainBlob} = this.state;
        const svgElement = this.svg.current;
        if (svgElement) {
            const screenCTM = svgElement.getScreenCTM();
            if (screenCTM) {
                const loc = pt.matrixTransform(screenCTM.inverse());
                const normalized = normalize(loc.x - width / 2, loc.y - height / 2);
                this.setState(prevState => ({
                    mainBlob: {
                        ...prevState.mainBlob,
                        position: {
                            x: mainBlob.position.x + normalized.x,
                            y: mainBlob.position.y + normalized.y
                        }
                    }
                }));
            }
        }
    }

    setPositionUpdater() {
        if (this.svg.current) {
            let point = this.svg.current.createSVGPoint();
            document.onmousemove = (e) => {
                point.x = e.clientX;
                point.y = e.clientY;
            };
            document.ontouchmove = (e) => {
                point.x = e.touches[0].clientX;
                point.y = e.touches[0].clientY;
            };
            setInterval(() => this.updatePosition(point), 20);
        }
    }

    eats(other: BlobData): boolean {
        const {mainBlob} = this.state;
        const distance = getMagnitude(mainBlob.position.x - other.position.x, mainBlob.position.y - other.position.y);
        if (distance < mainBlob.r + other.r) {
            this.setState(prevState => ({
                mainBlob: {
                    ...prevState.mainBlob,
                    r: getMagnitude(mainBlob.r, other.r)
                }
            }));
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

        const {mainBlob, blobsPositions} = this.state;

        return (
            <svg style={fullScreen} ref={this.svg} width={width} height={height}>
                <g style={transition}
                   transform={`translate(${width / 2}, ${height / 2}), scale(${initialSizeMainBlob / mainBlob.r})`}>
                    <g transform={`translate(${-mainBlob.position.x}, ${-mainBlob.position.y})`}>
                        <Blob id={mainBlob.id} position={{x: mainBlob.position.x, y: mainBlob.position.y}}
                              r={mainBlob.r}/>
                        {blobsPositions.map((blob: BlobData) =>
                            <Blob id={blob.id} position={{
                                x: blob.position.x,
                                y: blob.position.y
                            }} r={blob.r} key={blob.id}/>)}
                    </g>
                </g>
            </svg>
        );
    }
}

export default App;
