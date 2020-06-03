<script>
  import {onMount} from 'svelte'
  import {Oscillator} from '../Oscillator.js'
  import {audio} from '../audio.js'

  export let osc
  export let i

  let options = {
    frequency: {value: 0, min: -5000, max: 5000},
    finetune: {value: 0, min: -10, max: 10},
    detune: {value: 0, min: -1, max: 1},
    phase: {value: 0, min: -1, max: 1},
    volume: {value: 0, min: -1, max: 1}
  }

  let overtones = []

  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

  const set = (prop) => {
    let fnName = capitalize(prop)
    osc[`set${fnName}`](options[prop].value)
  }

  const reset = prop => {
    options[prop].value = 0
    set(prop, 0)
  }

  const addOvertone = () => {
    overtones.push(Oscillator(audio))
  }

  onMount(() => {
    osc.start()
  })
</script>

<oscillatorcontrols>
  <div class="oscillator">
    <p>Oscillator {i}</p>
    {#each Object.keys(options) as prop}
      <div class="slidecontainer">
        <span>{prop}</span> 
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
    <!-- <button on:click={addOvertone}>+</button>
    <div id="overtones{i}"></div> -->
  </div>
</oscillatorcontrols>

<style scoped=true>
oscillatorcontrols {
  text-align: center;
}
.slidecontainer {
  width: 100%;
}
.slidecontainer > input {
  width: 100%;
}
.slidecontainer > span {
  background-color: 'rgba(0,0,0,0.5)'
}
</style>