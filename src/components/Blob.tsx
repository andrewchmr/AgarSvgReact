import * as React from "react";

interface BlobProps {
    r: number;
    x: number;
    y: number;
}

const Blob = (props: BlobProps) => {
    const transition = {
        transition: "r 0.2s ease-in-out",
        WebkitTransition: "r 0.2s ease-in-out",
        MozTransition: "r 0.2s ease-in-out",
        OTransition: "r 0.2s ease-in-out"
    };
    return <circle style={transition} cx={props.x} cy={props.y} r={props.r} fill={"white"}/>
};

export default Blob;