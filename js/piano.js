const pianoKeys = document.querySelectorAll('.piano-keys .key'),
volumeSlider = document.querySelector('.volume-slider input'),
keysCheckbox = document.querySelector('.keys-checkbox input')
let allKeys = []
let audio = new Audio('./notes/a.wav');

const playTune = (key) => {
  audio.src = `./notes/${key}.wav`
  audio.play() // 播放音乐
  // console.log(allKeys)
  const clickedKey = document.querySelector(`[data-key='${key}']`)
  clickedKey.classList.add('active')
  setTimeout(() => {
    clickedKey.classList.remove('active')
  },150)
}

pianoKeys.forEach(key => {
  // 添加可点击的按键-array
  allKeys.push(key.dataset.key)
  key.addEventListener('click', () => {
    playTune(key.dataset.key)
  })
  // console.log(key.dataset.key)
})

const handleVolume = (e) => {
  audio.volume = e.target.value // 控制音量大小
}

const showHideKeys = () => {
  pianoKeys.forEach(key => key.classList.toggle('hide'))
}

const pressedKey = (e) =>{
  // console.log(e)
  // 判断点击按键是否包含allKeys数组
  if (allKeys.includes(e.key)) playTune(e.key)
}

// 键盘控制
document.addEventListener('keydown', pressedKey)

// 音量控制
volumeSlider.addEventListener('input', handleVolume)

// 是否显示按键名称
keysCheckbox.addEventListener('click', showHideKeys)