const Oscillator = (audio) => {

  let frequency = 0
  let detune = 0
  let finetune = 0
  let type = 'sine'
  let volume = 0.5
  let amFrequency = 0
  let phase = 0

  const oscL = audio.createOscillator()
  const oscR = audio.createOscillator()
  const merger = audio.createChannelMerger(2)
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

  const connect = (node) => {
    gainNode.connect(node)
  }
  const disconnect = (node) => {
    gainNode.disconnect(node)
  }

  const setPhase = (x) => {
    if(oscL.frequency.value==0)return
    if(oscR.frequency.value==0)return
    phase = x
    delayL.delayTime.value = x/oscL.frequency.value
    delayR.delayTime.value = -x/oscR.frequency.value
  }

  const setAM = (x) => {
    amFrequency = x
    amplitudeModulator.frequency.value = x
  }

  const setType = (x) => {
    type = x
    oscL.type = x
    oscR.type = x
  }

  const setVolume = (x) => {
    volume = x
    gainNode.gain.value = x
  }

  const setFrequency = (x) => {
    frequency = x
    oscL.frequency.value = x
    oscR.frequency.value = x
    setPhase(phase)
  }

  const setDetune = (x) => {
    detune = x
    oscL.detune.value = x
    oscR.detune.value = -x
  }

  const setFinetune = (x) => {
    finetune = x
    oscL.frequency.value = frequency + finetune
    oscR.frequency.value = frequency + finetune
    setPhase(phase)
  }

  const start = () => {
    oscL.start()
    oscR.start()
  }
  const stop = () => {
    oscL.stop()
    oscR.stop()
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

  merger.connect(gainNode)

  amplitudeModulator.connect(amGain)
  amGain.connect(gainNode.gain)
  
  oscL.connect(delayL)
  delayL.connect(merger,0,0)

  oscR.connect(delayR)
  delayR.connect(merger,0,1)

  return {

    frequency, detune, finetune, phase, volume,

    connect,
    disconnect,
    setPhase,
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