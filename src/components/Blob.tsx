import * as React from "react";

interface BlobProps {
    r: number;
    x: number;
    y: number;
}

class Blob extends React.Component<BlobProps, {}> {

    render() {
        const transition = {
            transition: "r 0.2s ease-in-out",
            WebkitTransition: "r 0.2s ease-in-out",
            MozTransition: "r 0.2s ease-in-out",
            OTransition: "r 0.2s ease-in-out"
        };
        return <circle style={transition} cx={this.props.x} cy={this.props.y} r={this.props.r} fill={"white"}/>
    }

}

export default Blob;