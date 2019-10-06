export interface Position {
    x: number,
    y: number
}

export interface BlobData {
    position: Position,
    r: number
}

export function getRandomPos(width: number, height: number): Position[] {
    let blobs = [];
    for (let i = 0; i < 100; ++i) {
        blobs.push({x: getRandomNumber(-width, width), y: getRandomNumber(-height, height)});
    }
    return blobs;
}

export function getRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function getMagnitude(x: number, y: number): number {
    return Math.sqrt(x * x + y * y);
}

export function normalize(x: number, y: number): Position {
    let magnitude = getMagnitude(x, y);
    if (magnitude > 0) {
        magnitude = magnitude / 2;
        return {x: x / magnitude, y: y / magnitude};
    } else {
        return {x: x, y: y}
    }
}