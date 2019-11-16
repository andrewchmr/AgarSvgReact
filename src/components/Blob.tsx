import * as React from "react";
import {BlobData} from "../utils";

const Blob = (props: BlobData) => {
    const transition = {
        transition: "r 0.2s ease-in-out",
        WebkitTransition: "r 0.2s ease-in-out",
        MozTransition: "r 0.2s ease-in-out",
        OTransition: "r 0.2s ease-in-out"
    };
    return <circle style={transition} cx={props.position.x} cy={props.position.y} r={props.r} fill={"white"}/>
};

export default Blob;