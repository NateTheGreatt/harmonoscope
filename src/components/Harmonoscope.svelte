<script>
  import {onMount} from 'svelte'
  import {Vectorscope} from '../Vectorscope.js'
  import {Oscillator} from '../Oscillator.js'
  import {audio} from '../audio.js'
  import OscillatorControls from './OscillatorControls.svelte'
  import GIF from 'gif.js'
  
  let canvas, vectorscope

  let width = 420
  let height = 420

  let oscillators = []

  let started = false
  const start = () => {
    if(started) return
    vectorscope = Vectorscope(audio, canvas, {
      scale: 1,
      style: 'lines',
      thickness: 1,
      color: '#FFFFFF',
      bgColor: 'rgba(0,0,0,1)'
      // trail: options.trail || 1
    })
    vectorscope.draw()
    started = true
  }

  const addOsc = () => {
    let osc = Oscillator(audio)
    oscillators = [...oscillators, osc]
    vectorscope.add(osc)
  }

  
  let gif, animationFrameId

  const addGifFrame = () => {
    gif.addFrame(canvas, {delay: 16.6, copy: true, width, height})
    animationFrameId = window.requestAnimationFrame(addGifFrame)
    console.log('aaa')
  }

  const gifStart = () => {
    gif = new GIF({
      workerScript: '/build/gif.worker.js',
      workers: 2,
      quality: 10
    })
    
    gif.on('finished', blob => {
      let link = document.getElementById('link')
      link.setAttribute('download', 'harmonoscope-render.gif')
      link.setAttribute('href', URL.createObjectURL(blob))
      link.click()
    })

    addGifFrame()
  }
  const gifStop = () => {
    window.cancelAnimationFrame(animationFrameId)
    gif.render()
  }
  
  const saveImg = () => {
    let link = document.getElementById('link')
    link.setAttribute('download', 'harmonoscope-snapshot.png')
    link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"))
    link.click()
  }

  const remove = (osc) => {
    osc.stop()
    oscillators = oscillators.filter((o,i) => oscillators.indexOf(osc) !== i)
  }

</script>

<harmonoscope>
  <button hidden={started} on:click={start}>Start</button>
  <div hidden={!started}>
    <canvas bind:this={canvas} width={width} height={height}></canvas>
    <div id="panel">
      <span id="title">Harmonoscope</span>
      <button id="addOsc" on:click={addOsc}>Add Oscillator</button>
      <a id="link"></a>
      <button id="saveImg" on:click={saveImg}>Snapshot</button>
      <button id="gifStart" on:click={gifStart}>Start Gif</button>
      <button id="gifStop" on:click={gifStop}>End Gif</button>
    </div>
    <div id="oscControls">
    {#each oscillators as osc, i}
      <OscillatorControls osc={osc} i={i} vectorscope={vectorscope} remove={remove} />
    {/each}
    </div>
  </div>
</harmonoscope>

<style scoped=true>
#panel {
  position: fixed;
  top: 10px;
  right: 10px;
  left: 10px;
  text-align: right;
  background: rgba(0,0,0,0.5);
  padding: 5px;
}
#title {
  float: left;
  color: #FFF;
  font-size: 24px;
  text-transform: uppercase;
}
#panel button {
  margin: 0;
}
#addOsc {
  position: relative;
}
#oscControls {
  margin-top: 60px;
}
canvas {
  position: fixed;
  top: 60px;
  left: 10px;
  opacity: 0.5;
  pointer-events: none;
  /* z-index: -1; */
}
</style>