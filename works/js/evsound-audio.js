const button1 = document.querySelector('#player-button1');
const audio1 = document.querySelector('.audio1');
const image1 = document.querySelector('.player-image1');
const button2 = document.querySelector('#player-button2');
const audio2 = document.querySelector('.audio2');
const image2 = document.querySelector('.player-image2');
const button3 = document.querySelector('#player-button3');
const audio3 = document.querySelector('.audio3');
const image3 = document.querySelector('.player-image3');
const button4 = document.querySelector('#player-button4');
const audio4 = document.querySelector('.audio4');
const image4 = document.querySelector('.player-image4');

button1.addEventListener('click', () =>{
  audio1.volume = 1;
  player1();
});
button2.addEventListener('click', () =>{
  audio2.volume = 1;
  player2();
});
button3.addEventListener('click', () =>{
  audio3.volume = 1;
  player3();
});
button4.addEventListener('click', () =>{
  audio4.volume = 1;
  player4();
});

function player1(){
    if (audio1.paused) {
        audio1.play();
        image1.style.animationPlayState = 'running';
     } else {
        audio1.pause();
        image1.style.animationPlayState = 'paused';
     }
};
function player2(){
  if (audio2.paused) {
      audio2.play();
      image2.style.animationPlayState = 'running';
   } else {
      audio2.pause();
      image2.style.animationPlayState = 'paused';
   }
};
function player3(){
  if (audio3.paused) {
      audio3.play();
      image3.style.animationPlayState = 'running';
   } else {
      audio3.pause();
      image3.style.animationPlayState = 'paused';
   }
};
function player4(){
  if (audio4.paused) {
      audio4.play();
      image4.style.animationPlayState = 'running';
   } else {
      audio4.pause();
      image4.style.animationPlayState = 'paused';
   }
};

window.onload = () => {
  image1.style.animationPlayState = 'paused';
  image2.style.animationPlayState = 'paused';
  image3.style.animationPlayState = 'paused';
  image4.style.animationPlayState = 'paused';
};