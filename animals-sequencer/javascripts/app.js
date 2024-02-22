var context;
var convolver;
var compressor;
var masterGainNode;
var effectLevelNode;
var equalizerNode;

var noteTime;
var startTime;
var lastDrawTime = -2;
var LOOP_LENGTH = 16;
var rhythmIndex = 0;
var timeoutId;
var testBuffer = null;

var currentKit = null;
var reverbImpulseResponse = null;

var tempo = 40;
var TEMPO_MAX = 120;
var TEMPO_MIN = 10;
var TEMPO_STEP = 1;

if (window.hasOwnProperty('AudioContext') && !window.hasOwnProperty('webkitAudioContext')) {
  window.webkitAudioContext = AudioContext;
}

$(function() {
  init();
  toggleSelectedListener();
  playPauseListener();
  lowPassFilterListener();
  reverbListener();
  distortionListener();
  createLowPassFilterSliders();
  initializeTempo();
  changeTempoListener();
});

function createLowPassFilterSliders() {
  $("#freq-slider").slider({
    value: 0.6,
    min: 0,
    max: 1,
    step: 0.01,
    disabled: true,
    slide: changeFrequency
  });
  $("#gain-slider").slider({
    value: 0.5,
    min: 0,
    max: 1,
    step: 0.01,
    disabled: true,
    slide: changeEQ
  });
}

function lowPassFilterListener() {
  $('#eq').click(function() {
    $(this).toggleClass("active");
    $(this).blur();
    if ($(this).hasClass("btn-default")) {
      $(this).removeClass("btn-default");
      $(this).addClass("btn-warning");
      equalizerNode.active = true;
      $("#freq-slider,#gain-slider").slider( "option", "disabled", false );
    }
    else {
      $(this).addClass("btn-default");
      $(this).removeClass("btn-warning");
      equalizerNode.active = false;
      $("#freq-slider,#gain-slider").slider( "option", "disabled", true );
    }
  })
}

function reverbListener() {
  $("#reverb").click(function() {
    $(this).toggleClass("active");
    $(this).blur();
    if ($(this).hasClass("btn-default")) {
      $(this).removeClass("btn-default");
      $(this).addClass("btn-warning");
      convolver.active = true;
    }
    else {
      $(this).addClass("btn-default");
      $(this).removeClass("btn-warning");
      convolver.active = false;
    }
  })
}

function distortionListener() {
  $("#distortion").click(function() {
    $(this).toggleClass("active");
    $(this).blur();
    if ($(this).hasClass("btn-default")) {
      $(this).removeClass("btn-default");
      $(this).addClass("btn-warning");
      distortion.active = true;
    }
    else {
      $(this).addClass("btn-default");
      $(this).removeClass("btn-warning");
      distortion.active = false;
    }
  })
}

function changeFrequency(event, ui) {
  var minValue = 40;
  var maxValue = context.sampleRate / 2;
  var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
  var multiplier = Math.pow(2, numberOfOctaves * (ui.value - 1.0));
  equalizerNode.frequency.value = maxValue * multiplier;
}

function changeEQ(event, ui) {
  //30 is the quality multiplier, for now. 
  equalizerNode.Q.value = ui.value * 30;
}

function playPauseListener() {
  $('#play-pause').click(function() {
    var $span = $(this).children("span");
    if($span.hasClass('glyphicon-play')) {
      $span.removeClass('glyphicon-play');
      $span.addClass('glyphicon-pause');
      handlePlay();
    } 
    else {
      $span.addClass('glyphicon-play');
      $span.removeClass('glyphicon-pause');
      handleStop();
    }
  });
}

function toggleSelectedListener() {
  $('.pad').click(function() {
    $(this).toggleClass("selected");
  });
}

function init() {
  initializeAudioNodes();
  loadKits();
  loadImpulseResponses();
}

// _________________________________________________________________

function initializeAudioNodes() {
  context = new webkitAudioContext();
  var finalMixNode;
  if (context.createDynamicsCompressor) {
      // 创建压缩器
      compressor = context.createDynamicsCompressor();
      compressor.connect(context.destination);
      finalMixNode = compressor;
  } else {
      finalMixNode = context.destination;
  }

  // 控制总音量
  masterGainNode = context.createGain();
  masterGainNode.gain.value = 0.7;
  masterGainNode.connect(finalMixNode);

  //connect所有声音到masterGainNode

  convolver = context.createConvolver();
  convolver.active = false;

  equalizerNode = context.createBiquadFilter();
  equalizerNode.type = "lowpass";
  equalizerNode.frequency.value = context.sampleRate / 2;
  equalizerNode.connect(masterGainNode);
  equalizerNode.active = false;
  
  distortion = context.createWaveShaper();
  distortion.active = false;

  function makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 50,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x;
    for ( ; i < n_samples; ++i ) {
      x = i * 2 / n_samples - 1;
      curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
  };

  distortion.curve = makeDistortionCurve(400);
  distortion.oversample = '4x';

  // 可视化
  analyser = context.createAnalyser();

}


function loadKits() {
  var kit = new Kit("animals");
  kit.load();
  currentKit = kit;
}

function loadImpulseResponses() {
  reverbImpulseResponse = new ImpulseResponse("sounds/impulse-responses/matrix-reverb2.wav");
  reverbImpulseResponse.load();
}

function loadTestBuffer() {
  var request = new XMLHttpRequest();
  var url = "http://www.freesound.org/data/previews/102/102130_1721044-lq.mp3";
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  request.onload = function() {
    context.decodeAudioData(
      request.response,
      function(buffer) { 
        testBuffer = buffer;
      },
      function(buffer) {
        console.log("Error decoding drum samples!");
      }
    );
  }
  request.send();
}

// 音序器按钮
function sequencePads() {
  $('.pad.selected').each(function() {
    $('.pad').removeClass("selected");
    $(this).addClass("selected");
  });
}

function parametric(inputConnection, outputConnection) {
  inputConnection.connect(masterGainNode);
  masterGainNode.connect(outputConnection);
}

// 声音输出
function playNote(buffer, noteTime) {
  var voice = context.createBufferSource();
  voice.buffer = buffer;

  var currentLastNode = masterGainNode;
  if (equalizerNode.active) {
    equalizerNode.connect(currentLastNode);
    currentLastNode = equalizerNode;
  }
  if (convolver.active) {
    convolver.buffer = reverbImpulseResponse.buffer;
    convolver.connect(currentLastNode);
    currentLastNode = convolver;
  }
  if (distortion.active) {
    distortion.connect(currentLastNode);
    currentLastNode = distortion;
  }

  voice.connect(currentLastNode);
  voice.start(noteTime);

  parametric(voice, analyser);
  analyser.connect(context.destination);
}

function schedule() {
  var currentTime = context.currentTime;

  // 初始化时间
  currentTime -= startTime;

  while (noteTime < currentTime + 0.200) {
      var contextPlayTime = noteTime + startTime;
      var $currentPads = $(".column_" + rhythmIndex);
      $currentPads.each(function() {
        if ($(this).hasClass("selected")) {
          var instrumentName = $(this).parents().data("instrument");
          switch (instrumentName) {
          case "gu":
            playNote(currentKit.guBuffer, contextPlayTime);
            break;
          case "miao":
            playNote(currentKit.miaoBuffer, contextPlayTime);
            break;
          case "duck":
            playNote(currentKit.duckBuffer, contextPlayTime);
            break;
          case "dog":
            playNote(currentKit.dogBuffer, contextPlayTime);
            break;
          case "ma":
            playNote(currentKit.maBuffer, contextPlayTime);
            break;
          case "mou":
            playNote(currentKit.mouBuffer, contextPlayTime);
            break;
          case "ta":
            playNote(currentKit.taBuffer, contextPlayTime);
            break;
          }
        }
      });
      if (noteTime != lastDrawTime) {
          lastDrawTime = noteTime;
          drawPlayhead(rhythmIndex);
      }
      advanceNote();
  }
  timeoutId = requestAnimationFrame(schedule)
}

function drawPlayhead(xindex) {
    var lastIndex = (xindex + LOOP_LENGTH - 1) % LOOP_LENGTH;

    var $newRows = $('.column_' + xindex);
    var $oldRows = $('.column_' + lastIndex);
    
    $newRows.addClass("playing");
    $oldRows.removeClass("playing");
}

function advanceNote() {
    tempo = Number($("#tempo-input").val());
    var secondsPerBeat = 60.0 / tempo;
    rhythmIndex++;
    if (rhythmIndex == LOOP_LENGTH) {
        rhythmIndex = 0;
    }
   
    noteTime += 0.25 * secondsPerBeat
}

function handlePlay(event) {
    rhythmIndex = 0;
    noteTime = 0.0;
    startTime = context.currentTime + 0.005;
    schedule();
}

function handleStop(event) {
  cancelAnimationFrame(timeoutId);
  $(".pad").removeClass("playing");
}

function initializeTempo() {
  $("#tempo-input").val(tempo);
}

function changeTempoListener() {
  $("#increase-tempo").click(function() {
    if (tempo < TEMPO_MAX) {
      tempo += TEMPO_STEP;
      $("#tempo-input").val(tempo);
    }
  });

  $("#decrease-tempo").click(function() {
    if (tempo > TEMPO_MIN) {
      tempo -= TEMPO_STEP;
      $("#tempo-input").val(tempo);
    } 
  });
}