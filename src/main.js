
const vectorscope = new Vectorscope(800,800,{
  	scale: 2,
  	style: 'dots',
  	thickness: 0.05,
    color: "#FFFFFF",
    bgColor: "#00000"
  	// bgColor: 'rgba(255,255,255,0.33)'
  	// trail: options.trail || 1
  })
vectorscope.draw()

let count = 1

const createOscillator = () => {
  let h = 1

  let n = count

  const html = `
    <div class="oscillator">
      <p>Frequency${n}</p>
      <div class="slidecontainer">
        <input type="range" min="-5000" max="5000" step="0.01" value="0" class="slider" id="frequency${n}">
      </div>
      <span>fine tune</span>
      <div class="slidecontainer">
        <input type="range" min="-600" max="600" step="0.01" value="0" class="slider" id="finetune${n}">
      </div>
      <span>detune</span>
      <div class="slidecontainer">
        <input type="range" min="-1" max="1" step="0.1" value="0" class="slider" id="detune${n}">
      </div>
      <button id="addHarmonic${n}">+</button>
      <div id="harmonics${n}"></div>
    </div>
  `
  const osc = new Oscillator()

  osc.setVolume(0.2)

  document.body.insertAdjacentHTML('beforeend',html)
  
  const frequency = document.querySelector(`#frequency${n}`)
  const finetune = document.querySelector(`#finetune${n}`)
  const detune = document.querySelector(`#detune${n}`)
  const addHarmonic = document.querySelector(`#addHarmonic${n}`)
  const harmonics = document.querySelector(`#harmonics${n}`)

  const harmonicArray = []

  addHarmonic.onclick = () => {
    const html2 = `
    <p>Harmonic${n}-${h}</p>
    <span>fine tune</span>
    <div class="slidecontainer">
      <input type="range" min="-600" max="600" step="0.01" value="0" class="slider" id="finetune${n}-${h}">
    </div>
    <span>detune</span>
    <div class="slidecontainer">
      <input type="range" min="-1" max="1" step="0.1" value="0" class="slider" id="detune${n}-${h}">
    </div>
    `
    harmonics.insertAdjacentHTML('beforeend', html2)
    
    const harmonicOsc = new Oscillator()
    harmonicArray.push(harmonicOsc)
    harmonicOsc.setFrequency(frequency.value*(harmonicArray.length+1))
    harmonicOsc.setVolume(osc.volume/(harmonicArray.length+1))

    const harmonicFine = document.querySelector(`#finetune${n}-${h}`)
    harmonicFine.oninput = function(e) {
      let amount = parseFloat(harmonicOsc.frequency + this.value)
      harmonicOsc.setFrequency(amount)
    }
    harmonicFine.ondblclick = () => {
      harmonicFine.value = 0
      harmonicOsc.setFrequency(harmonicOsc.frequency)
    }
    const harmonicDetune = document.querySelector(`#detune${n}-${h}`)
    harmonicDetune.oninput = function(e) {
      harmonicOsc.setDetune(this.value)
    }
    harmonicDetune.ondblclick = () => {
      harmonicDetune.value = 0
      harmonicOsc.setDetune(0)
    }
    
    vectorscope.add(harmonicOsc)
    harmonicOsc.start()

    h++

  }

  frequency.oninput = function(e) {
    harmonicArray.forEach((h,i) => h.setFrequency(this.value*(i+1)))
    osc.setFrequency(this.value)
  }
  frequency.ondblclick = () => {
    frequency.value = 0
    osc.setFrequency(0)
  }

  finetune.oninput = function(e) {
    let amount = parseFloat(frequency.value + this.value)
    osc.setFrequency(amount)
  }
  finetune.ondblclick = () => {
    finetune.value = 0
    osc.setFrequency(frequency.value)
  }

  detune.oninput = function(e) {
    osc.setDetune(this.value)
  }
  detune.ondblclick = () => {
    detune.value = 0
    osc.setDetune(0)
  }

  vectorscope.add(osc)

  osc.start()
  
  count++
}