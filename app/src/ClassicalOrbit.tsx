import * as React from 'react';
import * as THREE from 'three';

import Canvas from './Canvas';
import { CIRCLE_GEO } from './common';

interface IOrbitProps {
  color: string;
  a: number;
  e: number;
  i: number;
  O: number;
  w: number;
  v: number;
}

export default class ClassicalOrbit extends React.Component<IOrbitProps> {
  public static defaultProps: Partial<IOrbitProps> = {
    color: 'black',
  };
  private frame: THREE.Object3D;
  private object: THREE.Line;
  public constructor(props: IOrbitProps) {
    super(props);
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(this.props.color),
      linewidth: 2,
      opacity: 0.1,
      transparent: true,
    });
    const { a, e, i, O, w, v } = props;
    const b = a * Math.sqrt(1 - e * e);
    const obj = new THREE.Line(CIRCLE_GEO, mat);
    obj.scale.set(a, b, 0);
    this.object = obj;
  }
  public componentWillReceiveProps(props: IOrbitProps) {
    if (props.color !== this.props.color) {
      (this.object.material as THREE.LineBasicMaterial).color = new THREE.Color(props.color);
    }
    this.object.position.set(props.x, props.y, props.z);
    this.object.scale.setScalar(props.r);
  }
  public render() {
    return <Canvas.FrameContext>{this.handleFrame}</Canvas.FrameContext>;
  }
  private ellipseCenter() {

  }
  private handleFrame = (frame: THREE.Object3D) => {
    if (frame !== this.frame) {
      if (this.frame) {
        this.frame.remove(this.object);
      }
      if (frame) {
        frame.add(this.object);
      }
      this.frame = frame;
    }
    return null;
  }
}
