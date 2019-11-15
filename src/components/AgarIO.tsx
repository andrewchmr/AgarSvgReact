import React, {RefObject, useEffect, useRef, useState} from 'react';
import Blob from "./Blob";
import {clearInterval, setInterval} from "timers";
import {BlobData, Position} from "../types";

const width = window.innerWidth;
const height = window.innerHeight;
const initialSizeMainBlob = 50;
const delay = 20;
const numberOfBlobs = 200;

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
    useEffect(() => handleEatenBlobs());
    useInterval(() => updatePosition(position), delay);

    function handleEatenBlobs(): void {
        blobsPositions.forEach((pos: BlobData, index: number) => {
            if (eats(pos)) {
                const blobs = blobsPositions;
                blobs.splice(index, 1);
                setBlobsPositions(blobs);
            }
        });
    }

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

    function setPositionUpdater(): void {
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

    function getRandomPos(width: number, height: number, mainBlobR: number): BlobData[] {
        return Array(numberOfBlobs).fill(0).map((value, index) => {
            return {
                position: {x: getRandomNumber(-2 * width, 2 * width), y: getRandomNumber(-2 * height, 2 * height)},
                r: getRandomNumber(10, mainBlobR - 10),
                id: index
            }
        });
    }

    function getRandomNumber(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    function getMagnitude(x: number, y: number): number {
        return Math.sqrt(x * x + y * y);
    }

    function normalize(x: number, y: number): Position {
        let magnitude = getMagnitude(x, y);
        if (magnitude > 0) {
            magnitude = magnitude / 5;
            return {x: x / magnitude, y: y / magnitude};
        } else {
            return {x: x, y: y}
        }
    }

    return (
        <svg viewBox={`0 0 ${width} ${height}`} ref={svg}>
            <g className={'wrapper'}
               transform={`translate(${width / 2}, ${height / 2}), scale(${initialSizeMainBlob / mainBlob.r})`}>
                <g transform={`translate(${-mainBlob.position.x}, ${-mainBlob.position.y})`}>
                    <Blob id={mainBlob.id} position={{x: mainBlob.position.x, y: mainBlob.position.y}}
                          r={mainBlob.r}/>
                    <g>{blobsPositions.map((blob: BlobData) =>
                        <Blob id={blob.id} position={{
                            x: blob.position.x,
                            y: blob.position.y
                        }} r={blob.r} key={blob.id}/>)}</g>
                </g>
            </g>
        </svg>
    );
};

export default AgarIO;
