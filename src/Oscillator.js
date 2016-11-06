var audio = new (window.AudioContext || window.webkitAudioContext)();

var Oscillator = function() {

  this.frequency = 200;
  this.detune = 0;
  this.fine = 0;
  this.type = 'sine';
  this.volume = 0.5;
  this.lfoSpeed = 5;
  this.phaseOffset = 0;

  var OscL = audio.createOscillator();
  var OscR = audio.createOscillator();
  var merger = audio.createChannelMerger(2);
  var gainNode = audio.createGain();

  var lfo = audio.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = this.lfoSpeed;
  lfo.start();

  var lfoGain = audio.createGain();
  lfoGain.gain.value = 0.5;

  var delay = audio.createDelay();
  delay.delayTime.value = 0;

  this.connect = function(node) {
    gainNode.connect(node);
  }

  this.setPhaseOffset = function(x) {
    this.phaseOffset = x;
    delay.delayTime.value = x;
  }

  this.setLfoSpeed = function(x) {
    this.lfoSpeed = x;
    lfo.frequency.value = x;
  }

  this.setType = function(x) {
    this.type = x;
    OscL.type = x;
    OscR.type = x;
  }

  this.setVolume = function(x) {
    this.volume = x;
    gainNode.gain.value = x;
  };

  this.setFrequency = function(x) {
    this.frequency = x;
    OscL.frequency.value = x;
    OscR.frequency.value = x;
  };

  this.setDetune = function(x) {
    this.detune = x;
    OscL.detune.value = x;
    OscR.detune.value = -x;
  };

  this.setFine = function(x) {
    this.fine = x;
    OscL.frequency.value += x;
    OscR.frequency.value += x;
  };

  this.start = function() {
    OscL.start();
    OscR.start();
  }

  this.setType(this.type);
  this.setFrequency(this.frequency);
  this.setVolume(this.volume);

  merger.connect(gainNode);
  lfo.connect(lfoGain);
  // lfoGain.connect(gainNode.gain);
  OscL.connect(merger,0,0);
  OscR.connect(delay);
  delay.connect(merger,0,1);

};
