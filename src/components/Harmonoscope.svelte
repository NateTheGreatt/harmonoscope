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
      style: 'dots',
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
    gif.addFrame(canvas, {delay: 16.666, copy: true, width, height})
    animationFrameId = window.requestAnimationFrame(addGifFrame)
  }

  const gifStart = () => {
    gif = new GIF({
      workerScript: '/build/gif.worker.js',
      workers: 8,
      quality: 100
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
    vectorscope.remove(osc)
    osc.stop()
    oscillators = oscillators.filter((o,i) => oscillators.indexOf(osc) !== i)
  }

  let style = 'dots'
  const setStyle = () => vectorscope.options({style})

  let scale = 1
  const setScale = () => vectorscope.options({scale})
  
  let thickness = 1
  const setThickness = () => vectorscope.options({thickness})

  let trail = 1
  const setTrail = () => vectorscope.options({bgColor:`rgba(0,0,0,${trail})`})

  let perspective = 0
  const setPerspective = () => oscillators.forEach(o => o.setPhase2(perspective))

  let distance = 0
  const setDistance = () => oscillators.forEach(o => o.setPhase3(distance))

  // let lightSpeed = 0
  // const setLightSpeed = () => oscillators.forEach(o => o.setFrequency3(lightSpeed))

</script>

<harmonoscope>
  <button hidden={started} on:click={start}>Start</button>
  <div hidden={!started}>
    <div id="canvasWrap">
      <select bind:value={style} on:change={setStyle}>
        <option value="dots">dots</option>
        <option value="lines">lines</option>
      </select>
      <input type="range" min=0 max=10 step=0.000001 on:input={setScale} bind:value={scale} />
      <!-- <input type="range" min=0 max=1 step=0.000001 on:input={setThickness} bind:value={thickness} /> -->
      <input type="range" min=0 max=1 step=0.000001 on:input={setTrail} bind:value={trail} />
      <input type="range" min=0 max=1 step=0.000001 on:input={setPerspective} bind:value={perspective} />
      <input type="range" min=0 max=1 step=0.000001 on:input={setDistance} bind:value={distance} />
      <!-- <input type="range" min=0 max=1000 step=0.000001 on:input={setLightSpeed} bind:value={lightSpeed} /> -->
      <canvas bind:this={canvas} width={width} height={height}></canvas>
    </div>
    <div id="panel">
      <span id="title">Harmonoscope</span>
      <button id="addOsc" on:click={addOsc}>Add Oscillator</button>
      <!-- <a id="link"></a> -->
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
#canvasWrap {
  position: fixed;
  top: 60px;
  left: 10px;
}
canvas {
  position: fixed;
  top: 60px;
  left: 10px;
  opacity: 1;
  pointer-events: none;
  /* z-index: -1; */
}
#canvasWrap select {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  padding: 2px;
  font-size: 10px;
}
</style>