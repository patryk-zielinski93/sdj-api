import { Scene } from './scene';

export class Circle {
  innerDelta = 20;
  lineWidth = 7;
  private scene: Scene;
  private context: CanvasRenderingContext2D;
  r: number;

  init(scene: Scene): void {
    this.scene = scene;
    this.context = scene.context;
    this.draw();
  }

  draw(): void {
    this.drawEdging();
  }

  drawEdging(): void {
    this.context.save();
    this.context.beginPath();
    this.context.strokeStyle = 'rgba(254, 67, 101, 0.5)';
    this.context.lineWidth = 1;

    const offset = this.lineWidth / 2;
    this.context.moveTo(
      this.scene.padding + 2 * this.scene.radius - this.innerDelta - offset,
      this.scene.padding + this.scene.radius
    );
    this.context.arc(
      this.scene.cx,
      this.scene.cy,
      this.scene.radius - this.innerDelta - offset,
      0,
      2 * Math.PI, // 2 połówki
      false
    );

    this.context.stroke();
    this.context.restore();
  }
}
