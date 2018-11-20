import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';
import * as THREE from 'three';

import './Canvas.css';

interface ICanvasState {
  height: number;
  width: number;
}

const CameraContext = React.createContext<THREE.Camera>(null as any);
const FrameContext = React.createContext<THREE.Object3D>(null as any);

export default class Canvas extends React.Component<{}, ICanvasState> {
  public static CameraContext = CameraContext.Consumer;
  public static FrameContext = FrameContext.Consumer;
  public state = {
    height: 0,
    width: 0,
  };
  // Used for zooming on mac.
  private ogScale: number = 0;
  private scene = new THREE.Scene();
  private renderer: THREE.WebGLRenderer | null;
  private camera = new THREE.PerspectiveCamera(90, 1);
  private cameraFrame = new THREE.Group();
  public constructor(props: {}) {
    super(props);
    this.scene.add(new THREE.AxesHelper(2000));
    this.cameraFrame.add(this.camera);
    this.camera.position.set(0, 0, 5);
    this.cameraFrame.scale.setScalar(2);
    this.scene.add(this.cameraFrame);
    this.scene.background = new THREE.Color('white');
  }
  public render() {
    this.requestWebGLRender();
    return (
      <CameraContext.Provider value={this.camera}>
        <FrameContext.Provider value={this.scene}>
          <div className="Canvas">
            <canvas className="Canvas-canvas"
              width={this.state.width * window.devicePixelRatio}
              height={this.state.height * window.devicePixelRatio}
              ref={this.handleCanvas}
              onWheel={this.handleWheel}
            />
            <ReactResizeDetector
              handleWidth={true}
              handleHeight={true}
              onResize={this.handleResize}
            />
            {this.props.children}
          </div>
        </FrameContext.Provider>
      </CameraContext.Provider>
    );
  }
  private handleCanvas = (canvas: HTMLCanvasElement) => {
    if (canvas) {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
        devicePixelRatio: window.devicePixelRatio,
      });
      canvas.addEventListener('gesturestart', this.handleGestureStart);
      canvas.addEventListener('gesturechange', this.handleGestureChange);
    } else {
      this.renderer = null;
    }
  }
  private handleResize = (width: number, height: number) => {
    this.renderer!.setDrawingBufferSize(width, height, window.devicePixelRatio);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.setState({ width, height });
  }
  private handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey) {
      this.gestureZoom(Math.exp(e.deltaY / 80));
    } else {
      this.gesturePan(e.deltaX, e.deltaY);
    }
  }
  private handleGestureStart = (e: any) => {
    e.preventDefault();
    this.ogScale = 1;
  }
  private handleGestureChange = (e: any) => {
    e.preventDefault();
    this.gestureZoom(this.ogScale / e.scale);
    this.ogScale = e.scale;
  }
  private gestureZoom(s: number) {
    this.camera.position.multiplyScalar(s);
  }
  private gesturePan(x: number, y: number) {
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(y / 100, x / 100))
    this.cameraFrame.quaternion.multiply(q);
  }
  private requestWebGLRender() {
    if (this.renderer) {
      this.webGLRender();
    }
  }
  private webGLRender = () => {
    this.renderer!.render(this.scene, this.camera);
  }
}
