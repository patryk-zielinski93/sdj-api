import { Controls } from './controls';
import { Framer } from './framer';
import { Tracker } from './tracker';

export class Scene {
  context: CanvasRenderingContext2D;
  cx: number;
  cy: number;
  radius: number;
  scaleCoef: number;
  canvas: HTMLCanvasElement;

  padding = 120;
  minSize = 740;
  optimiseHeight = 982;
  _inProcess = false;
  private width: number;
  private height: number;
  coord: ClientRect | DOMRect;

  constructor(private framer: Framer, private tracker: Tracker, private controls: Controls) {
  }

  init() {
    this.canvasConfigure();
    this.initHandlers();

    this.framer.init(this);
    this.tracker.init(this);
    this.controls.init(this);

    this.startRender();
  }

  canvasConfigure() {
    this.canvas = document.querySelector('canvas');
    this.context = this.canvas.getContext('2d');
    this.context.strokeStyle = '#FE4365';
    this.calculateSize();
  }

  calculateSize() {
    this.scaleCoef = Math.max(0.5, 740 / this.optimiseHeight);

    const size = Math.max(this.minSize, 1/*document.body.clientHeight */);
    this.canvas.setAttribute('width', size.toString());
    this.canvas.setAttribute('height', size.toString());

    this.width = size;
    this.height = size;

    this.radius = (size - this.padding * 2) / 2;
    this.cx = this.radius + this.padding;
    this.cy = this.radius + this.padding;
    this.coord = this.canvas.getBoundingClientRect();
  }

  initHandlers() {
    window.onresize = () => {
      this.canvasConfigure();
      this.framer.configure();
      this.render();
    };
  }

  render() {
    requestAnimationFrame(() => {
      this.clear();
      this.draw();
      if (this._inProcess) {
        this.render();
      }
    });
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  draw() {
    this.framer.draw();
    this.tracker.draw();
    this.controls.draw();
  }

  startRender() {
    this._inProcess = true;
    this.render();
  }

  stopRender() {
    this._inProcess = false;
  }

  inProcess() {
    return this._inProcess;
  }
}
