import * as React from 'react';
import * as THREE from 'three';

import Canvas from './Canvas';

interface ITrajectoryProps {
  color: string;
  x: number[];
  y: number[];
  z: number[];
}

export default class Trajectory extends React.Component<ITrajectoryProps> {
  public static defaultProps: Partial<ITrajectoryProps> = {
    color: 'yellow',
  };
  private frame: THREE.Object3D;
  private object: THREE.Line;
  private geo: THREE.BufferGeometry;
  public constructor(props: ITrajectoryProps) {
    super(props);
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(this.props.color),
      linewidth: 2,
      opacity: 0.5,
      transparent: true,
    });
    const verts = new Float32Array(3 * props.x.length);
    for (let i = 0; i < props.x.length; i += 1) {
      verts[3 * i] = props.x[i];
      verts[3 * i + 1] = props.y[i];
      verts[3 * i + 2] = props.z[i];
    }
    console.log(props.x);
    this.geo = new THREE.BufferGeometry();
    this.geo.addAttribute('position', new THREE.BufferAttribute(verts, 3));
    const obj = new THREE.Line(this.geo, mat);
    this.object = obj;
  }
  public componentWillReceiveProps(props: ITrajectoryProps) {
    const verts = new Float32Array(3 * props.x.length);
    for (let i = 0; i < props.x.length; i += 1) {
      verts[3 * i] = props.x[i];
      verts[3 * i + 1] = props.y[i];
      verts[3 * i + 2] = props.z[i];
    }
    this.geo.addAttribute('position', new THREE.BufferAttribute(verts, 3));
  }
  public render() {
    return <Canvas.FrameContext>{this.handleFrame}</Canvas.FrameContext>;
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
