import * as React from "react";

import "./Slide.css";

export interface ISlideProps {
  visible?: boolean;
  title: string;
}

export default class Slide extends React.Component<ISlideProps, {}> {
  public static Fill = Fill;
  public static Title = Title;
  public static Subtitle = Subtitle;
  public render() {
    return (
      <div className="Slide" style={{ display: this.props.visible ? "block" : "none" }}>
        {this.props.children}
      </div>
    );
  }
}

export function Fill(props: React.Props<{}>) {
  return <div className="SlideFill">{props.children}</div>;
}

export function Title(props: React.Props<{}>) {
  return <div className="SlideTitle">{props.children}</div>;
}

export function Subtitle(props: React.Props<{}>) {
  return <div className="SlideSubtitle">{props.children}</div>;
}
