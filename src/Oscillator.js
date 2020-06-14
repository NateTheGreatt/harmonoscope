// TODO: synthesizer?
const Oscillator = (audio) => {

  let frequency = 0
  let detune = 0
  let finetune = 0
  let type = 'sine'
  let volume = 0.5
  let amFrequency = 0
  let phase = 0
  let phase2 = 0

  // dynamically add stereoscopic oscillator pairs via synth UI
  const oscL = audio.createOscillator()
  const oscR = audio.createOscillator()
  const oscL2 = audio.createOscillator()
  const oscR2 = audio.createOscillator()
  const merger = audio.createChannelMerger(4)
  const gainNode = audio.createGain()

  const amplitudeModulator = audio.createOscillator()
  amplitudeModulator.type = 'sine'
  amplitudeModulator.frequency.value = amFrequency

  const amGain = audio.createGain()
  amGain.gain.value = 0.5

  const delayR = audio.createDelay()
  delayR.delayTime.value = 0 

  const delayL = audio.createDelay()
  delayL.delayTime.value = 0

  const delayL2 = audio.createDelay()
  delayL2.delayTime.value = 0

  const delayR2 = audio.createDelay()
  delayR2.delayTime.value = 0

  const connect = (node) => {
    gainNode.connect(node)
  }
  const disconnect = (node) => {
    gainNode.disconnect(node)
  }

  const setPhase = (x) => {
    phase = x
    let f = oscL.frequency.value
    delayL.delayTime.value = f == 0 ? 0 : phase/oscL.frequency.value
    delayR.delayTime.value = f == 0 ? 0 : -phase/oscR.frequency.value
  }
  
  const setPhase2 = x => {
    phase2 = x
    let f = oscL2.frequency.value
    delayL2.delayTime.value = f == 0 ? 0 : phase2/oscL2.frequency.value
    delayR2.delayTime.value = f == 0 ? 0 : -phase2/oscR2.frequency.value
  }

  const setAM = (x) => {
    amFrequency = x
    amplitudeModulator.frequency.value = amFrequency
  }

  const setType = (x) => {
    type = x
    oscL.type = x
    oscR.type = x
    oscL2.type = x
    oscR2.type = x
  }

  const setVolume = (x) => {
    volume = x
    gainNode.gain.value = x
  }

  const setFrequency = (x) => {
    frequency = x
    oscL.frequency.value = frequency
    oscR.frequency.value = frequency
    oscL2.frequency.value = frequency
    oscR2.frequency.value = frequency
    setPhase(phase)
    setPhase2(phase2)
  }

  const setDetune = (x) => {
    detune = x
    oscL.detune.value = detune
    oscR.detune.value = -detune
    oscL2.detune.value = -detune
    oscR2.detune.value = -detune
  }

  const setFinetune = (x) => {
    finetune = x
    oscL.frequency.value = frequency + finetune
    oscR.frequency.value = frequency + finetune
    oscL2.frequency.value = frequency + finetune
    oscR2.frequency.value = frequency + finetune
    setPhase(phase)
    setPhase2(phase2)
  }

  const start = () => {
    oscL.start()
    oscR.start()
    oscL2.start()
    oscR2.start()
  }
  const stop = () => {
    oscL.stop()
    oscR.stop()
    oscL2.stop()
    oscR2.stop()
  }

  let amEnabled = false
  const toggleAM = () => {
    if(amEnabled) amplitudeModulator.stop()
    else amplitudeModulator.start()
    amEnabled = !amEnabled
  }

  setType(type)
  setFrequency(frequency)
  setVolume(volume)
  setPhase(phase)
  setPhase2(phase)

  merger.connect(gainNode)

  amplitudeModulator.connect(amGain)
  amGain.connect(gainNode.gain)
  
  oscL.connect(delayL)
  delayL.connect(merger,0,0)

  oscR.connect(delayR)
  delayR.connect(merger,0,1)

  oscL2.connect(delayL2)
  delayL2.connect(merger,0,2)

  oscR2.connect(delayR2)
  delayR2.connect(merger,0,3)

  return {

    frequency, detune, finetune, phase, phase2, volume, type,

    connect,
    disconnect,
    setPhase,
    setPhase2,
    setAM,
    setType,
    setVolume,
    setFrequency,
    setDetune,
    setFinetune,
    toggleAM,
    start,
    stop
  }
}

export { Oscillator }