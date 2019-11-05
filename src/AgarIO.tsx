import React, {RefObject, useEffect, useRef, useState} from 'react';
import Blob from "./components/Blob";
import {BlobData, getMagnitude, getRandomPos, normalize} from "./utils";
import {clearInterval, setInterval} from "timers";

const width = window.innerWidth;
const height = window.innerHeight;
const initialSizeMainBlob = 50;

const AgarIO = () => {
    const [mainBlob, setMainBlob] = useState<BlobData>({
        position: {
            x: 0,
            y: 0
        },
        r: initialSizeMainBlob,
        id: 0
    });
    const [blobsPositions, setBlobsPositions] = useState<BlobData[]>(getRandomPos(width, height, initialSizeMainBlob));
    const [position, setPosition] = useState();
    const svg: RefObject<SVGSVGElement> = useRef(null);
    useEffect(() => setPositionUpdater(), []);
    useEffect(() => {
        blobsPositions.forEach((pos: BlobData, index: number) => {
            if (eats(pos)) {
                const blobs = blobsPositions;
                blobs.splice(index, 1);
                setBlobsPositions(blobs);
            }
        });
    });
    useInterval(() => updatePosition(position), 20);

    function useInterval(callback: any, delay: any) {
        const savedCallback = useRef();
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);

        useEffect(() => {
            function tick() {
                (savedCallback as any).current();
            }

            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }

    function updatePosition(pt: DOMPoint): void {
        const svgElement = svg.current;
        if (svgElement) {
            const screenCTM = svgElement.getScreenCTM();
            if (screenCTM) {
                const loc = pt.matrixTransform(screenCTM.inverse());
                const normalized = normalize(loc.x - width / 2, loc.y - height / 2);
                setMainBlob({
                    ...mainBlob,
                    position: {
                        x: mainBlob.position.x + normalized.x,
                        y: mainBlob.position.y + normalized.y
                    }
                });
            }
        }
    }

    function setPositionUpdater() {
        if (svg.current) {
            let point = svg.current.createSVGPoint();
            document.onmousemove = (e) => {
                point.x = e.clientX;
                point.y = e.clientY;
            };
            document.ontouchmove = (e) => {
                point.x = e.touches[0].clientX;
                point.y = e.touches[0].clientY;
            };
            setPosition(point);
        }
    }

    function eats(other: BlobData): boolean {
        const distance = getMagnitude(mainBlob.position.x - other.position.x, mainBlob.position.y - other.position.y);
        if (distance < mainBlob.r + other.r) {
            setMainBlob({...mainBlob, r: getMagnitude(mainBlob.r, other.r)});
            return true;
        } else {
            return false;
        }
    }


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
        <svg style={fullScreen} ref={svg} width={width} height={height}>
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
};

export default AgarIO;
