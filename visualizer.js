const fileUpload = document.getElementById("fileupload");
let first = true;
let l;

class Visualizer {
  constructor() {
    const canvas = document.getElementById("canvas");
    const audio1 = document.getElementById("audio");
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const audioSource = audioCtx.createMediaElementSource(audio1);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const bufferLength = analyser.frequencyBinCount;
    this.barWidth = canvas.width / bufferLength;
    const dataArray = new Uint8Array(bufferLength);
    const padding = this.barWidth * 0.3;
    const ctx = canvas.getContext("2d");
    this.minHeight = 10;
    this.audio1 = audio1;
    this.canvas = canvas;
    this.padding = padding;
    this.audioCtx = audioCtx;
    this.audioSource = audioSource;
    this.analyser = analyser;
    this.bufferLength = bufferLength;
    this.dataArray = dataArray;
    this.ctx = ctx;
    this.fileUpload = fileUpload;

    this.barWidth =
      (canvas.width - this.padding) / this.bufferLength - this.padding;
    this.startX = this.padding;
    //this.debug(canvas, audio1, analyser, dataArray, padding);
    this.upload();
    this.checkWindow(canvas, dataArray, padding, bufferLength);
  }

  debug() {
    this.canvas.addEventListener("click", () => {
      this.audio1.src = "flaunch.wav";
      this.audio1.play();
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.analyser.getByteFrequencyData(this.dataArray);
    this.draw(this.bufferLength, this.barWidth, this.dataArray, this.padding);
    requestAnimationFrame(() => this.animate());
  }

  draw(bufferLength, barWidth, dataArray, padding) {
    const maxHeight = window.innerHeight * 0.7 - this.minHeight;
    const lgbtColors = [
      "#FF0018",
      "#FFA52C",
      "#FFFF41",
      "#008018",
      "#0000F9",
      "#86007D",
    ];

    for (let i = 0; i < bufferLength; i++) {
      const lerpAmount = i / (bufferLength - 1); // Calculate the lerp amount between 0 and 1
      const colorIndex1 = Math.floor(lerpAmount * (lgbtColors.length - 1));
      const colorIndex2 = Math.ceil(lerpAmount * (lgbtColors.length - 1));
      const color1 = lgbtColors[colorIndex1];
      const color2 = lgbtColors[colorIndex2];

      const red1 = parseInt(color1.substring(1, 3), 16);
      const green1 = parseInt(color1.substring(3, 5), 16);
      const blue1 = parseInt(color1.substring(5, 7), 16);

      const red2 = parseInt(color2.substring(1, 3), 16);
      const green2 = parseInt(color2.substring(3, 5), 16);
      const blue2 = parseInt(color2.substring(5, 7), 16);

      const red = Math.round((1 - lerpAmount) * red1 + lerpAmount * red2);
      const green = Math.round((1 - lerpAmount) * green1 + lerpAmount * green2);
      const blue = Math.round((1 - lerpAmount) * blue1 + lerpAmount * blue2);

      this.barHeight = dataArray[i] * (maxHeight / 265) + this.minHeight;
      this.ctx.fillStyle = `rgb(${red},${green},${blue})`;
      this.ctx.fillRect(
        this.startX,
        this.canvas.height - this.barHeight,
        this.barWidth,
        this.barHeight
      );
      this.startX += this.barWidth + this.padding;
    }
    this.startX = this.padding;
  }
  upload() {
    const files = this.fileUpload.files;
    this.audio1.src = URL.createObjectURL(files[0]);
    this.audio1.load();
    this.audio1.play();
    this.animate();
  }

  checkWindow() {
    window.addEventListener("resize", () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.barWidth =
        (canvas.width - this.padding) / this.bufferLength - this.padding;
      this.padding = this.barWidth * 0.3;
    });
  }
}

fileUpload.addEventListener("change", () => {
  if (first === true) {
    l = new Visualizer();
    first = false;
  } else {
    l.upload();
  }
});
