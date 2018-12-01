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

export let instance: Canvas = null as any;

export default class Canvas extends React.Component<{}, ICanvasState> {
  public static CameraContext = CameraContext.Consumer;
  public static FrameContext = FrameContext.Consumer;
  public state = {
    height: 0,
    width: 0,
  };
  public cameraFrame = new THREE.Group();

  // Used for zooming in Safari.
  private ogScale: number = 0;

  private scene = new THREE.Scene();
  private renderer: THREE.WebGLRenderer | null;
  private camera = new THREE.PerspectiveCamera(60, 1, 1e-1, 1e16);
  private rendered: boolean;
  public constructor(props: {}) {
    super(props);
    // this.scene.add(new THREE.AxesHelper(1e16));
    this.cameraFrame.add(this.camera);
    this.camera.position.set(0, 0, 1e8);
    this.scene.add(this.cameraFrame);
    instance = this;
  }
  public render() {
    this.webGLRender();
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
        alpha: true,
        antialias: true,
        canvas,
        clearAlpha: 0,
        devicePixelRatio: window.devicePixelRatio,
        logarithmicDepthBuffer: true,
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
    this.webGLRender();
  }
  private gesturePan(x: number, y: number) {
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(y / 100, x / 100))
    this.cameraFrame.quaternion.multiply(q);
    this.webGLRender();
  }
  private clearRendered = () => {
    this.rendered = false;
  }
  private webGLRender = () => {
    if (this.renderer && !this.rendered) {
      this.renderer!.render(this.scene, this.camera);
      this.rendered = true;
      requestAnimationFrame(this.clearRendered);
    }
  }
}
