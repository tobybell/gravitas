import * as React from 'react';

import Body from './Body';
import Canvas from './Canvas';
import Orbit from './Orbit';
import Player from './Player';
import { makeTimeSeries } from './timeSeries';

import * as simData from './3b.json';

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
  private sx: number[];
  private sy: number[];
  private x: number[];
  private y: number[];
  private mx: number[];
  private my: number[];
  private interval?: NodeJS.Timeout;
  public constructor(props: {}) {
    super(props);
    const data = transpose(simData);
    const times = [];
    for (let i = 0; i < simData.length; i += 1) {
      times.push(i * 1000);
    }
    this.sx = makeTimeSeries(times, data[1]);
    this.sy = makeTimeSeries(times, data[2]);
    this.x = makeTimeSeries(times, data[8]);
    this.y = makeTimeSeries(times, data[9]);
    this.mx = makeTimeSeries(times, data[15]);
    this.my = makeTimeSeries(times, data[16]);
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
          <Body x={this.sx[t]} y={this.sy[t]} z={0} r={6.955e8} color={'yellow'} />
          <Body x={this.x[t]} y={this.y[t]} z={0} r={6.955e6} color={'blue'} />
          <Body x={this.mx[t]} y={this.my[t]} z={0} r={1.7371e6} color={'orange'} />
          <Orbit r={149527418018.170166} color={'white'} />
        </Canvas>
        <Player
          min={0}
          max={31536000}
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
    this.setState({ t: (this.state.t + 1440) % 31536000 });
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
