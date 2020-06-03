<script>
  import {onMount} from 'svelte'
  import {Vectorscope} from '../Vectorscope.js'
  import {Oscillator} from '../Oscillator.js'
  import {audio} from '../audio.js'
  import OscillatorControls from './OscillatorControls.svelte'

  let canvas, vectorscope

  let oscillators = []

  let started = false
  const start = () => {
    if(started) return
    vectorscope = Vectorscope(audio, canvas, {
      scale: 1,
      style: 'dots',
      thickness: 1,
      color: '#FFFFFF',
      bgColor: 'rgba(0,0,0,0.33)'
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

</script>

<harmonoscope>
  <button hidden={started} on:click={start}>Start</button>
  <div hidden={!started}>
    <canvas bind:this={canvas} width={400} height={400}></canvas>
    <div id="right-panel">
      <button id="addOsc" on:click={addOsc}>Add Oscillator</button>
      <div id="oscControls">
      {#each oscillators as osc, i}
        <OscillatorControls osc={osc} i={i} />
      {/each}
      </div>
    </div>
  </div>
</harmonoscope>

<style scoped=true>
#right-panel{
  text-align: right;
}
#addOsc {
  position: relative;
}
canvas {
  position: absolute;
  left: 10px;
  top: 10px;
  opacity: 0.5;
  pointer-events: none;
}
</style>