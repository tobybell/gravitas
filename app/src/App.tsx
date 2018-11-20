import * as React from 'react';

import Body from './Body';
import Canvas from './Canvas';

import './App.css';
import Orbit from './Orbit';

export default class App extends React.Component {
  public state = {
    t: 0,
  };
  public componentDidMount() {
    setInterval(this.tick, 16);
  }
  public render() {
    const t = this.state.t;
    return (
      <div className="App">
        {true && <Canvas>
          <Body x={0} y={0} z={0} color={'yellow'} />
          <Body x={3 * Math.cos(t / 1000)} y={3 * Math.sin(t / 1000)} z={0} r={0.1} />
          <Orbit r={3} />
        </Canvas>}
      </div>
    );
  }
  private tick = () => {
    this.setState({ t: this.state.t + 1 });
  }
}
