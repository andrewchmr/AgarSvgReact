import React from 'react';
import logo from './logo.svg';
import './App.css';
import Blob from "./components/Blob";

const App: React.FC = () => {

    function getRandomNumber(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    let blobs = [];
    for (let i = 0; i < 10; ++i) {
        blobs.push(<Blob x={getRandomNumber(0, 600)} y={getRandomNumber(0, 600)} r={10} key={i}/>)
    }

    return (
        <div className="App">
            {/*   <header className="App-header">
              <img src={logo} className="App-logo" alt="logo"/>
              <h1 className="App-title">Flappy Bird (SVG + React)</h1>
          </header>*/}
            <p className="App-intro"/>
            <svg style={{backgroundColor: 'black'}} width={600} height={600}>
                <Blob x={600 / 2} y={600 / 2} r={50}/>
                {blobs}
            </svg>
        </div>
    );
};

export default App;
