// var ToroidModule = function() {
  var osc1 = new Oscillator();
  var osc2 = new Oscillator();

  osc1.setFrequency(300)
  osc1.setDetune(0.2);

  osc2.setFrequency(500);

  osc2.setDetune(0.2);
  setTimeout(function() {osc2.setDetune(0);}, 1540);

  var vectorscope = new Vectorscope();
  vectorscope.setChannels(osc1,osc2);

  osc1.start();
  osc2.start();

  vectorscope.draw();
// }
//
// var toroid = new ToroidModule();
