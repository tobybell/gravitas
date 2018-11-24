import * as React from 'react';

import Body from './Body';
import Canvas from './Canvas';
import Orbit from './Orbit';
import Player from './Player';
import { makeTimeSeries } from './timeSeries';
import Trajectory from './Trajectory';

import * as simData from './trajectory.json';

import './App.css';

function transpose(arr: number[][]): number[][] {
  const result: number[][] = arr[0].map(x => []);
  arr.forEach(row => {
    result.forEach((col, j) => {
      col.push(row[j]);
    });
  });
  return result;
}

export default class App extends React.Component {
  public state = {
    playing: false,
    t: 0,
  };
  private a: number[];
  private sx: number[];
  private sy: number[];
  // private sz: number[];
  // private x: number[];
  // private y: number[];
  // private mx: number[];
  // private my: number[];
  private data: number[][];
  private interval?: NodeJS.Timeout;
  public constructor(props: {}) {
    super(props);
    const data = this.data = transpose(simData);
    const times = data[3];
    
    this.a = makeTimeSeries(times, data[4]);
    this.sx = makeTimeSeries(times, data[0]);
    this.sy = makeTimeSeries(times, data[1]);
    // this.sz = makeTimeSeries(times, data[2]);
  }
  public componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  public render() {
    const t = this.state.t;
    return (
      <div className="App">
        <Canvas>
          <Body x={0} y={0} z={0} r={6.955e6} color={'blue'} focused={true} />
          <Body x={this.sx[t]} y={this.sy[t]} z={0} r={1.7371e6} color={'orange'} />
          <Orbit r={2e7} color="white" />
          <Trajectory x={this.data[0]} y={this.data[1]} z={this.data[2]} color={'orange'} />
        </Canvas>
        <div style={{
          color: 'white',
          left: '1.5rem',
          position: 'absolute',
          top: '1rem',
        }}>{this.a[t]}</div>
        <Player
          min={0}
          max={10000*60}
          time={t}
          playing={this.state.playing}
          onPlay={this.handlePlay}
          onPause={this.handlePause}
          onTimeChange={this.handleTimeChange}
        />
      </div>
    );
  }
  private tick = () => {
    this.setState({ t: (this.state.t + 1) % (10000 * 60) });
  }
  private handlePlay = () => {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(this.tick, 16);
    this.setState({ playing: true });
  }
  private handlePause = () => {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
    this.setState({ playing: false });
  }
  private handleTimeChange = (t: number) => {
    this.setState({ t });
  }
}
