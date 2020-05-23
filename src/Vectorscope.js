var Vectorscope = function(w,h,options) {

  var canvas = document.getElementById("canvas");
  var canvasCtx = canvas.getContext("2d");

  var analyser1 = audio.createAnalyser();
  var analyser2 = audio.createAnalyser();

  var splitter = audio.createChannelSplitter(2);

  // osc.connect(splitter);
  // osc2.connect(splitter)

  // console.log(splitter.numberOfOutputs);
  splitter.connect(analyser1,0,0);
  splitter.connect(analyser2,1,0);

  analyser1.fftSize = Math.pow(2,12); // must be power of two
  analyser2.fftSize = Math.pow(2,12); // and max of 32768

  var binCount = analyser1.frequencyBinCount;
  var wave1 = new Uint8Array(binCount);
  var wave2 = new Uint8Array(binCount);

  var WIDTH = w || 200,
      HEIGHT = h || 200;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  // set the origin to the center of the canvas
  canvasCtx.translate(canvas.width * 0.5, canvas.height * 0.5);

  // rotate 45 degrees
  canvasCtx.rotate(45*Math.PI/180);

  if(!options) options = {};

  var opts = {
  	scale: options.scale || 1,
  	style: options.style || 'lines',
  	thickness: options.thickness || 1.0,
  	color: options.color || "#000000",
  	bgColor: options.bgColor || 'rgba(255,255,255,0.33)',
  	trail: options.trail || 1
  }

  this.setChannels = function(ch1,ch2) {
    ch1.connect(splitter);
    ch2.connect(splitter);
  };

  this.add = node => node.connect(splitter)

  this.draw = function() {

    // canvasCtx.clearRect(-WIDTH,-HEIGHT,WIDTH*2,HEIGHT*2);
    canvasCtx.lineWidth = opts.thickness;
    canvasCtx.strokeStyle = opts.color;
    canvasCtx.fillStyle = opts.bgColor;

    canvasCtx.fillRect(-WIDTH,-HEIGHT,WIDTH*2,HEIGHT*2);

    analyser1.getByteTimeDomainData(wave1);
    analyser2.getByteTimeDomainData(wave2);

    canvasCtx.beginPath();

    for(var i=0; i<binCount; i++) {
      var a = wave1[i]-128;
      var b = wave2[i]-128;

      var x = a*opts.scale;
      var y = b*opts.scale;


      if(opts.style == 'lines') {
        canvasCtx.lineTo(x,y);
      } else if(opts.style == 'dots') {
        canvasCtx.arc(x, y, opts.thickness, 0, 2 * Math.PI, true);
      }

    }

    canvasCtx.stroke();

    window.requestAnimationFrame(this.draw.bind(this));

  };



}
