import * as React from 'react';

import './Player.css';

interface IPlayerProps {
  min: number;
  max: number;
  time: number;
  playing: boolean;
  onPlay: () => void;
  onPause: () => void;
  onTimeChange: (t: number) => void;
}

export default class Player extends React.Component<IPlayerProps> {
  public state = {
    scrubbing: false,
  };
  private wasPlaying = false;
  private scrubberRef = React.createRef<HTMLDivElement>();
  public render() {
    return (
      <div className="Player">
        {this.props.playing ? this.renderPauseButton() : this.renderPlayButton()}
        {this.renderScrubber()}
        <span className="Player-CurrTime">{this.formatTime(this.props.time)}</span>
        <span className="Player-Separator">/</span>
        <span className="Player-EndTime">{this.formatTime(this.props.max)}</span>
      </div>
    );
  }
  private renderPlayButton() {
    return (
      <svg className="Player-PlayButton"
        width={16}
        height={16}
        viewBox="0 0 16 16"
        onClick={this.props.onPlay}
      >
        <path d="M3 0l12 8l-12 8Z" />
      </svg>
    );
  }
  private renderPauseButton() {
    return (
      <svg className="Player-PauseButton"
        width={16}
        height={16}
        viewBox="0 0 16 16"
        onClick={this.props.onPause}
      >
        <rect x="2" y="0" width="4" height="16" />
        <rect x="10" y="0" width="4" height="16" />
      </svg>
    );
  }
  private renderScrubber() {
    const width = this.props.time / this.props.max * 100 + '%';
    return (
      <div className="Player-Scrubber"
        ref={this.scrubberRef}
        onMouseDown={this.handleScrubDown}
      >
        <div className="Player-ScrubberBackground">
          <div className="Player-ScrubberBar" style={{width}} />
        </div>
        {this.state.scrubbing && (
          <span className="Player-ScrubberTime" style={{ left: width }}>
            {this.formatTimePrecise(this.props.time)}
          </span>
        )}
      </div>
    );
  }
  private handleScrubDown = (e: React.MouseEvent) => {
    this.setState({ scrubbing: true });
    this.wasPlaying = this.props.playing;
    e.preventDefault();
    window.addEventListener('mousemove', this.handleScrubMove);
    window.addEventListener('mouseup', this.handleScrubUp);
    this.props.onPause.call(undefined);
    this.handleScrubMove(e.nativeEvent);
  }
  private handleScrubMove = (e: MouseEvent) => {
    if (this.scrubberRef.current) {
      const {left, width} = this.scrubberRef.current.getBoundingClientRect();
      const time = Math.max(0, Math.min(1, (e.clientX - left) / width)) * this.props.max;
      this.props.onTimeChange.call(undefined, time);
    }
  }
  private handleScrubUp = () => {
    this.setState({ scrubbing: false });
    window.removeEventListener('mousemove', this.handleScrubMove);
    window.removeEventListener('mouseup', this.handleScrubUp);
    if (this.wasPlaying) {
      this.props.onPlay.call(undefined);
    }
  }
  private formatTime(t: number) {
    const [d, h, min, s] = this.splitTime(t);

    const sStr = ('00' + s).substr(-2);
    const minStr = h ? ('00' + min).substr(-2) : '' + min;
    const hStr = h ? h + ':' : '';
    const dStr = d ? d + 'd ' : '';

    return dStr + hStr + minStr + ':' + sStr;
  }
  private formatTimePrecise(t: number) {
    const [d, h, min, s, f] = this.splitTime(t);
    const ms = Math.floor(f * 1000);

    const msStr = ('000' + ms).substr(-3);
    const sStr = ('00' + s).substr(-2);
    const minStr = h ? ('00' + min).substr(-2) : '' + min;
    const hStr = h ? h + ':' : '';
    const dStr = d ? d + 'd ' : '';

    return dStr + hStr + minStr + ':' + sStr + '.' + msStr;
  }
  private splitTime(t: number): [number, number, number, number, number] {
    const f = t % 1;
    const s = Math.floor(t % 60);
    const min = Math.floor(t / 60 % 60);
    const h = Math.floor(t / 3600 % 24);
    const d = Math.floor(t / 86400);
    return [d, h, min, s, f];
  }
}
