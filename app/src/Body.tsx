import * as React from 'react';
import * as THREE from 'three';

import Canvas, { instance } from './Canvas';
import { SPHERE_GEO } from './common';

interface IBodyProps {
  color: string;
  r: number;
  x: number;
  y: number;
  z: number;
  focused: boolean;
}

export default class Body extends React.Component<IBodyProps> {
  public static defaultProps: Partial<IBodyProps> = {
    color: 'black',
    focused: false,
    r: 1,
    x: 0,
    y: 0,
    z: 0,
  };
  private frame: THREE.Object3D;
  private object: THREE.Mesh;
  private group = new THREE.Group();
  public constructor(props: IBodyProps) {
    super(props);
    const mat = new THREE.MeshBasicMaterial({color: this.props.color});
    const obj = new THREE.Mesh(SPHERE_GEO, mat);
    obj.scale.setScalar(this.props.r);
    this.object = obj;
    this.group.add(obj);
  }
  public componentDidMount() {
    this.group.position.set(this.props.x, this.props.y, this.props.z);
    if (this.props.focused) {
      console.log(instance.cameraFrame);
      this.group.add(instance.cameraFrame);
    }
  }
  public componentWillReceiveProps(props: IBodyProps) {
    if (props.color !== this.props.color) {
      (this.object.material as THREE.MeshBasicMaterial).color = new THREE.Color(props.color);
    }
    this.group.position.set(props.x, props.y, props.z);
  }
  public render() {
    return <Canvas.FrameContext>{this.handleFrame}</Canvas.FrameContext>;
  }
  private handleFrame = (frame: THREE.Object3D) => {
    if (frame !== this.frame) {
      if (this.frame) {
        this.frame.remove(this.group);
      }
      if (frame) {
        frame.add(this.group);
      }
      this.frame = frame;
    }
    return null;
  }
}
