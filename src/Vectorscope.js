function normalize(min, max, val) { 
  if(max - min === 0) return 1; // or 0, it's up to you
  return (val - min) / (max - min); 
}
const Vectorscope = (audio, canvas, _options={}) => {

  let opts = {
    width: canvas.width || 200,
    height: canvas.height || 200,
  	scale: _options.scale || 1,
  	style: _options.style || 'lines',
  	thickness: _options.thickness || 1.0,
  	color: _options.color || "#rgba(0,0,0,1)",
  	bgColor: _options.bgColor || 'rgba(255,255,255,0.33)',
  	trail: _options.trail || 1.0
  }

  const canvasCtx = canvas.getContext("2d")

  const analyser1 = audio.createAnalyser()
  const analyser2 = audio.createAnalyser()
  const analyser3 = audio.createAnalyser()
  const analyser4 = audio.createAnalyser()

  const splitter = audio.createChannelSplitter(4)

  splitter.connect(analyser1,0,0)
  splitter.connect(analyser2,1,0)
  splitter.connect(analyser3,2,0)
  splitter.connect(analyser4,3,0)

  analyser1.fftSize = Math.pow(2,12) // must be power of two
  analyser2.fftSize = Math.pow(2,12) // and max of 32768
  analyser3.fftSize = Math.pow(2,12)
  analyser4.fftSize = Math.pow(2,12)

  const binCount = analyser1.frequencyBinCount
  const wave1 = new Uint8Array(binCount)
  const wave2 = new Uint8Array(binCount)
  const wave3 = new Uint8Array(binCount)
  const wave4 = new Uint8Array(binCount)

  const {width} = opts
  const {height} = opts

  // set the origin to the center of the canvas
  canvasCtx.translate(canvas.width * 0.5, canvas.height * 0.5)

  // rotate 45 degrees
  canvasCtx.rotate(45*Math.PI/180)

  const setChannels = (ch1,ch2) => {
    ch1.connect(splitter)
    ch2.connect(splitter)
  }

  const add = node => node.connect(splitter)
  const remove = node => node.disconnect(splitter)

  let hsl = {h:0,s:1,l:0.5}

  const draw = () => {

    // canvasCtx.clearRect(-width,-height,width*2,height*2)
    canvasCtx.lineWidth = opts.thickness
    canvasCtx.strokeStyle = opts.color
    canvasCtx.fillStyle = opts.bgColor

    canvasCtx.fillRect(-width,-height,width*2,height*2)

    analyser1.getByteTimeDomainData(wave1)
    analyser2.getByteTimeDomainData(wave2)
    analyser3.getByteTimeDomainData(wave3)
    analyser4.getByteTimeDomainData(wave4)

    if(opts.style == 'lines') 
      canvasCtx.beginPath()

    for(let i=0; i<binCount; i++) {

      // hsl.h = i % 360
      // let {h,s,l} = hsl
      // canvasCtx.strokeStyle = `hsl(${h},${s*100}%,${l*100}%)`

      const a = wave1[i]-128 // L  /^\_/^\
      const b = wave2[i]-128 // R    /^\_/^\
      const c = wave3[i]
      // const d = wave4[i]-128

      const x = a*opts.scale
      const y = b*opts.scale
      // const z = normalize(0, 1, Math.abs(c + d/2) / 10)

      if(opts.style == 'lines') {
        canvasCtx.lineTo(x,y)
      } else if(opts.style == 'dots') {
        canvasCtx.beginPath()
        canvasCtx.arc(x, y, c/25, 0, 2 * Math.PI)
        // canvasCtx.fillStyle = `rgba(255,255,255,${c/256})`
        canvasCtx.fillStyle = `hsl(255, 100%, ${(c/256)*100}%)`
        canvasCtx.fill()
        // canvasCtx.stroke()
      }
      
    }

    if(opts.style == 'lines') 
      canvasCtx.stroke()

    window.requestAnimationFrame(draw)

  }

  const options = o => Object.assign(opts, o)

  return {
    setChannels,
    add,
    remove,
    draw,
    options
  }

}

export { Vectorscope }