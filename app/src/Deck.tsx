import * as React from "react";

import { ISlideProps } from "./Slide";

import "./Deck.css";

interface IDeckProps {
  children: React.ReactNode,
};

interface IDeckState {
  currentSlide: number,
};

export default class Deck extends React.Component<IDeckProps, IDeckState> {
  public state = {
    currentSlide: 0,
  };
  public render() {
    return (
      <div className="Deck" tabIndex={0} onKeyDown={this.handleKeyDown}>
        {this.renderSlide(this.state.currentSlide - 1, false)}
        {this.renderSlide(this.state.currentSlide, true)}
        {this.renderSlide(this.state.currentSlide + 1, false)}
      </div>
    );
  }
  public renderSlide(index: number, visible: boolean) {
    const slides = React.Children.toArray(this.props.children) as Array<React.ReactElement<ISlideProps>>;
    if (index >= 0 && index < slides.length) {
      return React.cloneElement(slides[index], { visible });
    } else {
      return null;
    }
  }
  private setCurrentSlideIndex(index: number) {
    const lo = 0;
    const hi = React.Children.count(this.props.children) - 1;
    this.setState({ currentSlide: Math.min(Math.max(index, lo), hi) });
  }
  private handleKeyDown = (e: React.KeyboardEvent) => {
    const k = e.keyCode;
    if (k === 39 || k === 40 || k === 32) {
      this.setCurrentSlideIndex( this.state.currentSlide + 1 );
    } else if (k === 37 || k === 38) {
      this.setCurrentSlideIndex( this.state.currentSlide - 1 );
    }
  }
}
