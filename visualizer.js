const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");

const root = document.getElementById("root");
const canvas = document.getElementById("canvas");
const fileUpload = document.getElementById("fileupload");
let isPlayed = true;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");
let audio1;  // Declare audio1 outside the root event listener

root.addEventListener("click", () => {
  if (!isPlayed) return null;
  isPlayed = false;
  audio1 = document.getElementById("audio");
  audio1.src = "moms_workout_cd.wav"
  audio1.load();
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const audioSource = audioCtx.createMediaElementSource(audio1);
  audio1.play();
  analyser = audioCtx.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 32768;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  const barWidth = canvas.width / bufferLength;

  let barHeight;
  let x;

  function animate() {
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] * 3;
      ctx.fillStyle = "white";
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth;
    }
    requestAnimationFrame(animate);
  }
  animate();
});

fileUpload.addEventListener("change", function(){
  const files = this.files;
  audio1.src = URL.createObjectURL(files[0]);
  audio1.load();
  audio1.play();
});
