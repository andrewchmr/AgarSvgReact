import * as React from "react";

interface BlobProps {
    r: number;
    x: number;
    y: number;
}

class Blob extends React.Component<BlobProps, {}> {

    render() {
        return <circle cx={this.props.x} cy={this.props.y} r={this.props.r} fill={"white"}/>
    }

}

export default Blob;