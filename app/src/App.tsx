import * as React from 'react';

import Body from './Body';
import Canvas from './Canvas';
// import Orbit from './Orbit';
import Player from './Player';
import { makeTimeSeries } from './timeSeries';
import Trajectory from './Trajectory';

import * as simData from './trajectory.json';

import './App.css';
// import Deck from './Deck';
// import Slide from './Slide';

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
  // private a: number[];
  private sx: number[];
  private sy: number[];
  // private sz: number[];
  // private x: number[];
  // private y: number[];
  // private mx: number[];
  // private my: number[];
  private data: number[][];
  private interval?: NodeJS.Timeout;
  private maxTime: number;
  public constructor(props: {}) {
    super(props);
    const data = this.data = transpose(simData);
    const times = data[3];
    
    // this.a = makeTimeSeries(times, data[4]);
    this.sx = makeTimeSeries(times, data[0]);
    this.sy = makeTimeSeries(times, data[1]);

    this.maxTime = times[times.length - 1];
    // this.sz = makeTimeSeries(times, data[2]);
  }
  public componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  public render() {
    const t = this.state.t;
    // return (
    //   <div className="App">
    //     <Deck>
    //       <Slide title="0" />
    //       <Slide title="1">
    //         <Slide.Title>Simulation</Slide.Title>
    //         <Slide.Subtitle>Overfit</Slide.Subtitle>
    //         <Slide.Fill>
    //           <Canvas>
    //             <Body x={0} y={0} z={0} r={6.955e6} color={'blue'} focused={true} />
    //             <Body x={this.sx[t]} y={this.sy[t]} z={0} r={8e5} color={'orange'} />
    //             <Orbit r={2e7} color="white" />
    //             <Trajectory x={this.data[0]} y={this.data[1]} z={this.data[2]} color={'orange'} />
    //           </Canvas>
    //         </Slide.Fill>
    //       </Slide>
    //       <Slide title="2" />
    //     </Deck>
    //   </div>
    // );
    return (
      <div className="App">
        <Canvas>
          <Body x={0} y={0} z={0} r={1e6} color={'#5599ff'} focused={true} />
          <Body x={this.sx[t]} y={this.sy[t]} z={0} r={5e5} color={'white'} />
          {/* <Orbit r={2e7} color="white" /> */}
          <Trajectory x={this.data[0]} y={this.data[1]} z={this.data[2]} color={'white'} />
        </Canvas>
        {/* <div style={{
          color: 'white',
          left: '1.5rem',
          position: 'absolute',
          top: '1rem',
        }}>{this.a[t]}</div> */}
        <Player
          min={0}
          max={this.maxTime}
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
    this.setState({ t: (this.state.t + 300) % this.maxTime });
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
