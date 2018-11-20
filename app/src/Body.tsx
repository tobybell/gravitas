import * as React from 'react';
import * as THREE from 'three';

import Canvas from './Canvas';
import { SPHERE_GEO } from './common';

interface IBodyProps {
  color: string;
  r: number;
  x: number;
  y: number;
  z: number;
}

export default class Body extends React.Component<IBodyProps> {
  public static defaultProps: Partial<IBodyProps> = {
    color: 'black',
    r: 1,
    x: 0,
    y: 0,
    z: 0,
  };
  private frame: THREE.Object3D;
  private object: THREE.Mesh;
  public constructor(props: IBodyProps) {
    super(props);
    const mat = new THREE.MeshBasicMaterial({color: this.props.color});
    const obj = new THREE.Mesh(SPHERE_GEO, mat);
    obj.scale.setScalar(this.props.r);
    this.object = obj;
  }
  public componentWillReceiveProps(props: IBodyProps) {
    if (props.color !== this.props.color) {
      (this.object.material as THREE.MeshBasicMaterial).color = new THREE.Color(props.color);
    }
    this.object.position.set(props.x, props.y, props.z);
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
