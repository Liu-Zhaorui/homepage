var NUM_INSTRUMENTS = 2;

function Kit(name) {
  this.SAMPLE_BASE_PATH = "sounds/anim-samples/";
  this.name = name;

  this.guBuffer = null;
  this.miaoBuffer = null;
  this.duckBuffer = null;
  this.dogBuffer = null;
  this.maBuffer = null;
  this.mouBuffer = null;
  this.taBuffer = null;

  this.startedLoading = false;
  this.isLoaded = false;
  this.instrumentLoadCount = 0;
}

Kit.prototype.pathName = function() {
  return this.SAMPLE_BASE_PATH + this.name + "/";
};

Kit.prototype.load = function() {
  if (this.startedLoading) {
    return;
  }

  this.startedLoading = true;

  var pathName = this.pathName();

  var guPath = pathName + "gu.wav";
  var miaoPath = pathName + "miao.wav";
  var duckPath = pathName + "duck.wav";
  var dogPath = pathName + "dog.wav";
  var maPath = pathName + "ma.wav";
  var mouPath = pathName + "mou.wav";
  var taPath = pathName + "ta.wav";

  this.loadSample(guPath, "gu");
  this.loadSample(miaoPath, "miao");
  this.loadSample(duckPath, "duck");
  this.loadSample(dogPath, "dog");
  this.loadSample(maPath, "ma");
  this.loadSample(mouPath, "mou");
  this.loadSample(taPath, "ta");
};


Kit.prototype.loadSample = function(url, instrumentName) {

  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var kit = this;

  request.onload = function() {
    context.decodeAudioData(
      request.response,
      function(buffer) {
        switch (instrumentName) {
          case "gu":
            kit.guBuffer = buffer;
            break;
          case "miao":
            kit.miaoBuffer = buffer;
            break;
          case "duck":
            kit.duckBuffer = buffer;
            break;
          case "dog":
            kit.dogBuffer = buffer;
            break;
          case "ma":
            kit.maBuffer = buffer;
          case "mou":
            kit.mouBuffer = buffer;
            break;
          case "ta":
            kit.taBuffer = buffer;
        }
        kit.instrumentLoadCount++;
        if (kit.instrumentLoadCount === NUM_INSTRUMENTS) {
          kit.isLoaded = true;
        }
      },
      function(buffer) {
        console.log("Error decoding samples!");
      }
    );
  }
  request.send();
}