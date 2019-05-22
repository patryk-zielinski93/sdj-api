import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { environment } from '@environment/environment.prod';
import { Observable } from 'rxjs';

@Component({
    selector: 'sdj-awesome-player',
    templateUrl: './awesome-player.component.html',
    styleUrls: ['./awesome-player.component.scss']
})
export class AwesomePlayerComponent implements OnInit, AfterViewInit {
    get track$(): Observable<any> {
        return this._track$;
    }

    @Input()
    mediaElement: HTMLMediaElement;

    @Input()
    set track$(value: Observable<any>) {
        this._track$ = value;
        if (this.player) {
            this.player.track = this.track$;
        }
    }

    private _track$: Observable<any>;

    private player: Player;
    private framer: Framer;
    private scene: Scene;

    constructor() {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.framer = new Framer();
        const tracker = new Tracker();
        this.framer.tracker = tracker;
        const controls = new Controls();

        this.scene = new Scene(this.framer, tracker, controls);
        this.player = new Player(this.scene, this.framer, this.mediaElement);
        if (this.track$) {
            this.player.track = this.track$;
        }

        controls.player = this.player;
        controls.scene = this.scene;
        controls.tracker = tracker;

        tracker.player = this.player;

        this.player.init();
    }

}

class Player {
    get track(): Observable<any> {
        return this._track;
    }

    set track(value: Observable<any>) {
        this._track = value;
        this.handleTrackChange();
    }

    buffer = null;
    duration = 0;
    private _track: Observable<any>;
    //     [
    //   {
    //     artist: 'Fernando Riviera',
    //     song: 'Ha ha ha. Wspaniale',
    //     url: environment.backendUrl + 'tracks/VB8UjNxpkdI.mp3'
    //   },
    //   {
    //     artist: 'Naruto Shippudent',
    //     song: 'Samidare',
    //     url: environment.backendUrl + 'tracks/OyXcAdvLsqI.mp3'
    //   },
    //   {
    //     artist: 'Kavinsky',
    //     song: 'Odd Look ft. The Weeknd',
    //     url: '//katiebaca.com/tutorial/odd-look.mp3'
    //   }
    // ];

    private analyser: AnalyserNode;
    context: AudioContext;
    private currentSongIndex: number;
    private destination: AudioDestinationNode;
    private firstLaunch: boolean;
    private gainNode: GainNode;
    private javascriptNode: ScriptProcessorNode;
    source: MediaStreamAudioSourceNode;

    constructor(private scene: Scene, private framer: Framer, private mediaElement: HTMLMediaElement) {
    }

    async init() {
        (<any>window).AudioContext = (<any>window).AudioContext || (<any>window).webkitAudioContext;
        this.context = new AudioContext();
        this.context.suspend && this.context.suspend();
        this.firstLaunch = true;
        try {
            this.javascriptNode = this.context.createScriptProcessor(2048, 1, 1);
            this.javascriptNode.connect(this.context.destination);
            this.analyser = this.context.createAnalyser();
            this.analyser.connect(this.javascriptNode);
            this.analyser.smoothingTimeConstant = 0.6;
            this.analyser.fftSize = 2048;
            const audio = new Audio(environment.radioStreamUrl);
            const stream = audio.captureStream();
            await audio.play(); // stream now has input
            this.source = this.context.createMediaStreamSource(stream);
            this.destination = this.context.destination;

            this.gainNode = this.context.createGain();
            this.source.connect(this.gainNode);
            this.gainNode.connect(this.analyser);
            this.gainNode.connect(this.destination);

            this.initHandlers();
        } catch (e) {
            this.framer.setLoadingPercent(1);
        }
        this.framer.setLoadingPercent(1);
        this.scene.init();
    }

    handleTrackChange(): void {
        this._track.subscribe((track) => {
            try {
                this.context.suspend();
            } catch (e) {
            }
            const convertedTrack = {
                artist: 'DJ PAWEŁ',
                song: track.track.title,
                url: environment.backendUrl + 'tracks/' + track.track.id + '.mp3'
            };
        });
    }

    loadTrack(track) {
        const request = new XMLHttpRequest();
        document.querySelector('.song .artist').textContent = track.artist;
        document.querySelector('.song .name').textContent = track.song;
        // this.currentSongIndex = index;

        request.open('GET', track.url, true);
        request.responseType = 'arraybuffer';

        request.onload = () => {
            this.context.decodeAudioData(request.response, (buffer) => {
                // this.source.buffer = buffer;
            });
        };

        request.send();
    }

    nextTrack() {
        // ++this.currentSongIndex;
        // if (this.currentSongIndex == this.tracks.length) {
        //     this.currentSongIndex = 0;
        // }
        // this.source.stop();
        // this.source = this.context.createBufferSource();
        // this.source.connect(this.gainNode);
        // this.loadTrack(this.currentSongIndex);
        // this.source.start();
    }

    prevTrack() {
        //   --this.currentSongIndex;
        //   if (this.currentSongIndex == -1) {
        //     this.currentSongIndex = this.tracks.length - 1;
        //   }
        //
        //   this.source.stop();
        //   this.source = this.context.createBufferSource();
        //   this.source.connect(this.gainNode);
        //   this.loadTrack(this.currentSongIndex);
        //   this.source.start();
    }

    //
    play() {
        this.context.resume && this.context.resume();
        if (this.firstLaunch) {
            this.context.resume();
            this.firstLaunch = false;
        }
    }

    stop() {
        // TODO this.context.currentTime = 0;
        this.context.suspend();
    }

    pause() {
        this.context.suspend();
    }

    mute() {
        this.gainNode.gain.value = 0;
    }

    unmute() {
        this.gainNode.gain.value = 1;
    }

    initHandlers() {
        this.javascriptNode.onaudioprocess = () => {
            this.framer.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(this.framer.frequencyData);
        };
    }
}

class Controls {

    playing = false;
    private context: CanvasRenderingContext2D;
    private timeControl: Element;
    private playButton: HTMLButtonElement;
    private pauseButton: HTMLButtonElement;
    private soundButton: HTMLButtonElement;
    private prevSongButton: HTMLButtonElement;
    private nextSongButton: HTMLButtonElement;

    scene: Scene;
    player: Player;
    tracker: Tracker;

    init(scene) {
        this.scene = scene;
        this.context = scene.context;
        this.initHandlers();
        this.timeControl = document.querySelector('.time');
    }

    initHandlers() {
        this.initPlayButton();
        this.initPauseButton();
        this.initSoundButton();
        this.initPrevSongButton();
        this.initNextSongButton();
        this.initTimeHandler();
    }

    initPlayButton() {
        this.playButton = document.querySelector('.play');
        this.playButton.addEventListener('mouseup', () => {
            this.playButton.style.display = 'none';
            this.pauseButton.style.display = 'inline-block';
            this.player.play();
            this.playing = true;
        });
    }

    initPauseButton() {
        this.pauseButton = document.querySelector('.pause');
        this.pauseButton.addEventListener('mouseup', () => {
            this.playButton.style.display = 'inline-block';
            this.pauseButton.style.display = 'none';
            this.player.pause();
            this.playing = false;
        });
    }

    initSoundButton() {
        this.soundButton = document.querySelector('.soundControl');
        this.soundButton.addEventListener('mouseup', () => {
            if (this.soundButton.classList.contains('disable')) {
                this.soundButton.classList.remove('disable');
                this.player.unmute();
            } else {
                this.soundButton.classList.add('disable');
                this.player.mute();
            }
        });
    }

    initPrevSongButton() {
        this.prevSongButton = document.querySelector('.prevSong');
        this.prevSongButton.addEventListener('mouseup', () => {
            this.player.prevTrack();
            this.playing && this.player.play();
        });
    }

    initNextSongButton() {
        this.nextSongButton = document.querySelector('.nextSong');
        this.nextSongButton.addEventListener('click', () => {
            this.player.nextTrack();
            this.playing && this.player.play();
        });
    }

    initTimeHandler() {
        setTimeout(() => {
            const rawTime = this.player.context.currentTime || 0;
            const secondsInMin = 60;
            let min = Math.floor(rawTime / secondsInMin).toString();
            let seconds = Math.floor(rawTime - parseInt(min) * secondsInMin).toString();
            if (parseInt(min) < 10) {
                min = '0' + min;
            }
            if (parseInt(seconds) < 10) {
                seconds = '0' + seconds;
            }
            this.timeControl.textContent = min + ':' + seconds;
            this.initTimeHandler();
        }, 300);
    }

    draw() {
        this.drawPic();
    }

    drawPic() {
        this.context.save();
        this.context.beginPath();
        this.context.fillStyle = 'rgba(254, 67, 101, 0.85)';
        this.context.lineWidth = 1;
        let x = this.tracker.r / Math.sqrt(Math.pow(Math.tan(this.tracker.angle), 2) + 1);
        let y = Math.sqrt(this.tracker.r * this.tracker.r - x * x);
        if (this.getQuadrant() == 2) {
            x = -x;
        }
        if (this.getQuadrant() == 3) {
            x = -x;
            y = -y;
        }
        if (this.getQuadrant() == 4) {
            y = -y;
        }
        this.context.arc(this.scene.radius + this.scene.padding + x, this.scene.radius + this.scene.padding + y, 10, 0, Math.PI * 2, false);
        this.context.fill();
        this.context.restore();
    }

    getQuadrant() {
        if (0 <= this.tracker.angle && this.tracker.angle < Math.PI / 2) {
            return 1;
        }
        if (Math.PI / 2 <= this.tracker.angle && this.tracker.angle < Math.PI) {
            return 2;
        }
        if (Math.PI < this.tracker.angle && this.tracker.angle < Math.PI * 3 / 2) {
            return 3;
        }
        if (Math.PI * 3 / 2 <= this.tracker.angle && this.tracker.angle <= Math.PI * 2) {
            return 4;
        }
    }
}

class Scene {
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
        //this.canvas.style.marginTop = -size / 2 + 'px';
        //this.canvas.style.marginLeft = -size / 2 + 'px';

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

class Tracker {
    innerDelta = 20;
    lineWidth = 7;
    prevAngle = 0.5;
    angle = 0;
    animationCount = 10;
    pressButton = false;
    private animateId: any;
    private scene: Scene;
    private context: CanvasRenderingContext2D;
    private animatedInProgress: boolean;
    private mx: number;
    private my: number;
    r: number;

    player: Player;

    init(scene) {
        this.scene = scene;
        this.context = scene.context;
        this.initHandlers();
    }

    initHandlers() {
        this.scene.canvas.addEventListener('mousedown', (e) => {
            if (this.isInsideOfSmallCircle(e) || this.isOusideOfBigCircle(e)) {
                return;
            }
            this.prevAngle = this.angle;
            this.pressButton = true;
            this.stopAnimation();
            this.calculateAngle(e, true);
        });

        window.addEventListener('mouseup', () => {
            if (!this.pressButton) {
                return;
            }
            const id = setInterval(() => {
                if (!this.animatedInProgress) {
                    this.pressButton = false;
                    // TODO
                    // (<any>this.player.context).currentTime = this.angle / (2 * Math.PI) * this.player.source.buffer.duration;
                    clearInterval(id);
                }
            }, 100);
        });

        window.addEventListener('mousemove', (e) => {
            if (this.animatedInProgress) {
                return;
            }
            if (this.pressButton && this.scene.inProcess()) {
                this.calculateAngle(e, this.animatedInProgress);
            }
        });
    }

    isInsideOfSmallCircle(e) {
        const x = Math.abs(e.pageX - this.scene.cx - this.scene.coord.left);
        const y = Math.abs(e.pageY - this.scene.cy - this.scene.coord.top);
        return Math.sqrt(x * x + y * y) < this.scene.radius - 3 * this.innerDelta;
    }

    isOusideOfBigCircle(e) {
        return Math.abs(e.pageX - this.scene.cx - this.scene.coord.left) > this.scene.radius ||
            Math.abs(e.pageY - this.scene.cy - this.scene.coord.top) > this.scene.radius;
    }

    draw() {
        // if (!this.player.source.buffer) {
        //     return;
        // }
        // if (!this.pressButton) {
        //     this.angle = this.player.context.currentTime / this.player.source.buffer.duration * 2 * Math.PI || 0;
        // }
        // this.drawArc();
    }

    drawArc() {
        this.context.save();
        this.context.strokeStyle = 'rgba(254, 67, 101, 0.8)';
        this.context.beginPath();
        this.context.lineWidth = this.lineWidth;

        this.r = this.scene.radius - (this.innerDelta + this.lineWidth / 2);
        this.context.arc(
            this.scene.radius + this.scene.padding,
            this.scene.radius + this.scene.padding,
            this.r, 0, this.angle, false
        );
        this.context.stroke();
        this.context.restore();
    }

    calculateAngle(e, animatedInProgress) {
        this.animatedInProgress = animatedInProgress;
        this.mx = e.pageX;
        this.my = e.pageY;
        this.angle = Math.atan((this.my - this.scene.cy - this.scene.coord.top) / (this.mx - this.scene.cx - this.scene.coord.left));
        if (this.mx < this.scene.cx + this.scene.coord.left) {
            this.angle = Math.PI + this.angle;
        }
        if (this.angle < 0) {
            this.angle += 2 * Math.PI;
        }
        if (animatedInProgress) {
            this.startAnimation();
        } else {
            this.prevAngle = this.angle;
        }
    }

    startAnimation() {
        var angle = this.angle;
        var l = Math.abs(this.angle) - Math.abs(this.prevAngle);
        var step = l / this.animationCount, i = 0;
        var f = () => {
            this.angle += step;
            if (++i == this.animationCount) {
                this.angle = angle;
                this.prevAngle = angle;
                this.animatedInProgress = false;
            } else {
                this.animateId = setTimeout(f, 20);
            }
        };

        this.angle = this.prevAngle;
        this.animateId = setTimeout(f, 20);
    }

    stopAnimation() {
        clearTimeout(this.animateId);
        this.animatedInProgress = false;
    }
}

class Framer {

    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    count: number;
    maxTickSize: number;
    scene: Scene;
    ticks: { x1: number, y1: number, x2: number, y2: number }[];

    countTicks = 360;
    frequencyData: Uint8Array | Array<any> = [];
    tickSize = 10;
    PI = 360;
    index = 0;
    loadingAngle = 0;

    tracker: Tracker;

    init(scene: Scene) {
        this.canvas = document.querySelector('canvas');
        this.scene = scene;
        this.context = scene.context;
        this.configure();
    }

    configure() {
        this.maxTickSize = this.tickSize * 9 * this.scene.scaleCoef;
        this.countTicks = 360 * this.scene.scaleCoef;
    }

    draw() {
        this.drawTicks();
        this.drawEdging();
    }

    drawTicks() {
        this.context.save();
        this.context.beginPath();
        this.context.lineWidth = 1;
        this.ticks = this.getTicks(this.countTicks, this.tickSize, [0, 90]);
        for (var i = 0, len = this.ticks.length; i < len; ++i) {
            var tick = this.ticks[i];
            this.drawTick(tick.x1, tick.y1, tick.x2, tick.y2);
        }
        this.context.restore();
    }

    drawTick(x1, y1, x2, y2) {
        var dx1 = parseInt(this.scene.cx + x1);
        var dy1 = parseInt(this.scene.cy + y1);

        var dx2 = parseInt(this.scene.cx + x2);
        var dy2 = parseInt(this.scene.cy + y2);

        var gradient = this.context.createLinearGradient(dx1, dy1, dx2, dy2);
        gradient.addColorStop(0, '#FE4365');
        gradient.addColorStop(0.6, '#FE4365');
        gradient.addColorStop(1, '#F5F5F5');
        this.context.beginPath();
        this.context.strokeStyle = gradient;
        this.context.lineWidth = 2;
        this.context.moveTo(this.scene.cx + x1, this.scene.cx + y1);
        this.context.lineTo(this.scene.cx + x2, this.scene.cx + y2);
        this.context.stroke();
    }

    setLoadingPercent(percent) {
        this.loadingAngle = percent * 2 * Math.PI;
    }

    drawEdging() {
        this.context.save();
        this.context.beginPath();
        this.context.strokeStyle = 'rgba(254, 67, 101, 0.5)';
        this.context.lineWidth = 1;

        var offset = this.tracker.lineWidth / 2;
        this.context.moveTo(this.scene.padding + 2 * this.scene.radius - this.tracker.innerDelta - offset, this.scene.padding + this.scene.radius);
        this.context.arc(this.scene.cx, this.scene.cy, this.scene.radius - this.tracker.innerDelta - offset, 0, this.loadingAngle, false);

        this.context.stroke();
        this.context.restore();
    }

    getTicks(count, size, animationParams) {
        size = 10;
        var ticks = this.getTickPoitns(count);
        var x1, y1, x2, y2, m = [], tick, k;
        var lesser = 160;
        var allScales = [];
        for (var i = 0, len = ticks.length; i < len; ++i) {
            var coef = 1 - i / (len * 2.5);
            var delta = ((this.frequencyData[i] || 0) - lesser * coef) * this.scene.scaleCoef;
            if (delta < 0) {
                delta = 0;
            }
            tick = ticks[i];
            if (animationParams[0] <= tick.angle && tick.angle <= animationParams[1]) {
                k = this.scene.radius / (this.scene.radius - this.getSize(tick.angle, animationParams[0], animationParams[1]) - delta);
            } else {
                k = this.scene.radius / (this.scene.radius - (size + delta));
            }
            x1 = tick.x * (this.scene.radius - size);
            y1 = tick.y * (this.scene.radius - size);
            x2 = x1 * k;
            y2 = y1 * k;
            m.push({ x1: x1, y1: y1, x2: x2, y2: y2 });
            if (i < 20) {
                var scale = delta / 50;
                scale = scale < 1 ? 1 : scale;
                allScales.push(scale);
            }
        }
        var sum = allScales.reduce(function(pv, cv) {
            return pv + cv;
        }, 0) / allScales.length;
        this.canvas.style.transform = 'scale(' + sum + ')';
        return m;
    }

    getSize(angle, l, r) {
        var m = (r - l) / 2;
        var x = (angle - l);
        var h;

        if (x == m) {
            return this.maxTickSize;
        }
        var d = Math.abs(m - x);
        var v = 70 * Math.sqrt(1 / d);
        if (v > this.maxTickSize) {
            h = this.maxTickSize - d;
        } else {
            h = Math.max(this.tickSize, v);
        }

        if (this.index > this.count) {
            this.index = 0;
        }

        return h;
    }

    getTickPoitns(count) {
        var coords = [], step = this.PI / count;
        for (var deg = 0; deg < this.PI; deg += step) {
            var rad = deg * Math.PI / (this.PI / 2);
            coords.push({ x: Math.cos(rad), y: -Math.sin(rad), angle: deg });
        }
        return coords;
    }
}
