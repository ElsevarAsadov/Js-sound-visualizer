class Visualizer {
  constructor() {
    const canvas = document.getElementById("canvas");
    const fileUpload = document.getElementById("fileupload");
    const padding = 60;
    const audio1 = document.getElementById("audio");
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const audioSource = audioCtx.createMediaElementSource(audio1);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 32;
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const ctx = canvas.getContext("2d");
    
    
    this.audio1 = audio1;
    this.canvas = canvas;
    this.padding = padding;
    this.audioCtx = audioCtx;
    this.audioSource = audioSource;
    this.analyser = analyser;
    this.bufferLength = bufferLength;
    this.dataArray = dataArray;
    this.ctx = ctx;
    this.fileUpload = fileUpload
    this.barWidth = canvas.width / this.bufferLength;
    this.debug(canvas, audio1, analyser, dataArray, padding);
    this.upload(fileUpload, audio1);
    this.checkWindow(canvas, dataArray, padding, bufferLength);
  }

  debug() {
    this.canvas.addEventListener("click", () => {
      this.audio1.src = "flaunch.wav";
      this.audio1.play();
      this.barWidth =
        (canvas.width - this.padding) / this.bufferLength - this.padding;
      this.startX = this.padding;
      this.animate();
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.analyser.getByteFrequencyData(this.dataArray);
    this.draw(this.bufferLength, this.barWidth, this.dataArray, this.padding);
    requestAnimationFrame(() => this.animate());
  }

  draw(bufferLength, barWidth, dataArray, padding) {
    for (let i = 0; i < bufferLength; i++) {
      this.barHeight = dataArray[i];
      let red = (i * this.barHeight) / 10;
      let green = i * 4;
      let blue = this.barHeight / 1.3;
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
    this.fileUpload.addEventListener("change", () => {
      const files = this.fileUpload.files;
      this.audio1.src = URL.createObjectURL(files[0]);
      this.audio1.load();
      this.audio1.play();
    });
  }

  checkWindow() {
    window.addEventListener("resize", () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.padding = this.canvas.width / 10;
  
      this.barWidth = (this.canvas.width - this.padding) / this.bufferLength - this.padding;
      this.barHeight = (this.dataArray[i] / max) * this.canvas.height * 0.4;
    });
  }
}

const l = new Visualizer();
