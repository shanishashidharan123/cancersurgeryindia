// JavaScript Document
function csitime() {
  $d = new Date();
  $date = $d.getDate();
  if ($date < 10) {
    $date = "0" + $date;
  }
  $month = $d.getMonth() + 1;
  if ($month < 10) {
    $month = "0" + $month;
  }
  $year = $d.getFullYear();
  $hh = $d.getHours();
  if ($hh < 10) {
    $hh = "0" + $hh;
  }
  $mm = $d.getMinutes();
  if ($mm < 10) {
    $mm = "0" + $mm;
  }
  $datenow = $date + "-" + $month + "-" + $year + ", " + $hh + ":" + $mm;
  $("#date").html($datenow);
}
var canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation;

function init() {
  canvas = document.getElementById("canvas");
  anim_container = document.getElementById("animation_container");
  dom_overlay_container = document.getElementById("dom_overlay_container");
  var comp = AdobeAn.getComposition("BF605A349BC2D54BBC6CBD63BC729866");
  var lib = comp.getLibrary();
  var loader = new createjs.LoadQueue(false);
  loader.addEventListener("fileload", function (evt) {
    handleFileLoad(evt, comp)
  });
  loader.addEventListener("complete", function (evt) {
    handleComplete(evt, comp)
  });
  var lib = comp.getLibrary();
  loader.loadManifest(lib.properties.manifest);
}

function handleFileLoad(evt, comp) {
  var images = comp.getImages();
  if (evt && (evt.item.type == "image")) {
    images[evt.item.id] = evt.result;
  }
}

function handleComplete(evt, comp) {
  //This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
  var lib = comp.getLibrary();
  var ss = comp.getSpriteSheet();
  var queue = evt.target;
  var ssMetadata = lib.ssMetadata;
  for (i = 0; i < ssMetadata.length; i++) {
    ss[ssMetadata[i].name] = new createjs.SpriteSheet({
      "images": [queue.getResult(ssMetadata[i].name)],
      "frames": ssMetadata[i].frames
    })
  }
  exportRoot = new lib.csifeatures();
  stage = new lib.Stage(canvas);
  //Registers the "tick" event listener.
  fnStartAnimation = function () {
    stage.addChild(exportRoot);
    createjs.Ticker.framerate = lib.properties.fps;
    createjs.Ticker.addEventListener("tick", stage);
  }
  //Code to support hidpi screens and responsive scaling.
  AdobeAn.makeResponsive(true, 'both', false, 1, [canvas, anim_container, dom_overlay_container]);
  AdobeAn.compositionLoaded(lib.properties.id);
  fnStartAnimation();
}
$(function () {
  init();
  csitime();
  setInterval(csitime, 60000);
});
