import * as React from "react";
import {BlobData} from "../types";

const Blob = (props: BlobData) => {
    return <circle className={'blob'} cx={props.position.x} cy={props.position.y} r={props.r} fill={"white"}/>
};

export default Blob;