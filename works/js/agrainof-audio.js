const button = document.querySelector('#player-button');
const audio = document.querySelector('.audio');
const image = document.querySelector('.player-image');

button.addEventListener('click', () =>{
  audio.volume = 1;
  player();
});

function player(){
    if (audio.paused) {
        audio.play();
        image.style.animationPlayState = 'running';
     } else {
        audio.pause();
        image.style.animationPlayState = 'paused';
     }
};

window.onload = () => {
  image.style.animationPlayState = 'paused';
};