<script>
  import {onMount} from 'svelte'
  import {Oscillator} from '../Oscillator.js'
  import {audio} from '../audio.js'

  export let osc
  export let i
  export let vectorscope
  export let undertone
  export let remove

  let options = {
    frequency: {value: osc.frequency, min: -5000, max: 5000},
    finetune: {value: osc.finetune, min: -10, max: 10},
    // detune: {value: osc.detune, min: -1, max: 1},
    phase: {value: osc.phase, min: -1, max: 1},
    volume: {value: osc.volume, min: -1, max: 1}
  }

  if(undertone) {
    Object.keys(options).forEach(p => {
      options[p].value = undertone[p]
    })
  }

  let overtones = []

  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

  const set = (prop) => {
    let fnName = capitalize(prop)
    let fn = osc[`set${fnName}`]
    fn(parseFloat(options[prop].value))
  }

  const reset = prop => {
    options[prop].value = 0
    set(prop, 0)
  }

  const addOvertone = () => {
    let overtone = Oscillator(audio)
    let f = options.frequency.value*(overtones.length+2)
    overtone.setFrequency(f)
    overtone.setPhase(options.phase.value)
    overtone.setVolume(options.volume.value/2)
    overtones = [...overtones, overtone]
  }

  const removeOvertone = (overtone) => {
    vectorscope.remove(overtone)
    overtone.stop()
    overtones = overtones.filter((o,i) => overtones.indexOf(overtone) !== i)
  }

  let mute = false
  const toggleMute = () => {
    mute = !mute
    if(mute) osc.disconnect(audio.destination)
    else osc.connect(audio.destination)
  }

  const setType = () => {
    osc.setType(osc.type)
  }

  onMount(() => {
    
    // defaults
    if(!undertone) {
      // osc.setFrequency(100)
      // osc.setPhase(0.25)
    }

    vectorscope.add(osc)
    osc.start()
    osc.connect(audio.destination)
  })
</script>

<oscillatorcontrols>
  <div class="oscillator">
    <div id="header">
      <select bind:value={osc.type} on:change={setType}>
        <option value='sine'>sine</option>
        <option value='square'>square</option>
        <option value='sawtooth'>sawtooth</option>
        <option value='triangle'>triangle</option>
      </select>
      <b>Oscillator {i}</b>
      <button on:click={toggleMute}>{mute ? 'Unmute' : 'Mute'}</button>
      <button on:click={remove(osc)}>Remove</button>
    </div>
    {#each Object.keys(options) as prop}
      <div class="slidecontainer">
        <div>{prop}</div> 
        <div class="inputs">
          <input type=text bind:value={options[prop].min}>
          <input type=text bind:value={options[prop].value} on:input={set(prop)}>
          <input type=text bind:value={options[prop].max}>
        </div>
        <input type=range
          min={options[prop].min}
          max={options[prop].max}
          step=0.000001
          bind:value={options[prop].value}
          class="slider"
          on:input={set(prop)}
          on:dblclick={reset(prop)}
        />
      </div>
    {/each}
    <button on:click={addOvertone}>Add Overtone</button>
    <div class="overtones">
      {#each overtones as overtone,i}
        <svelte:self osc={overtone} i={i} vectorscope={vectorscope} remove={removeOvertone} undertone={osc} />
      {/each}
    </div>
  </div>
  <hr />
</oscillatorcontrols>

<style scoped=true>
hr {
  margin: 25px 0 25px 0;
}
#header {
  text-align: center;
  background-color: rgba(0,0,0,0.2);
  padding: 5px;
}
#header button, select {
  height: 24px;
  font-size: 14px;
  padding: 2px;
}
oscillatorcontrols {
  text-align: center;
}
.slidecontainer {
  width: 100%;
}
.slidecontainer > input {
  width: 100%;
}
.slidecontainer .inputs input {
  width: 6em;
}
.slidecontainer > span {
  background-color: rgba(0,0,0,0.5);
}
.overtones {
  text-align: center;
  width: 60%;
  margin: auto;
}
</style>