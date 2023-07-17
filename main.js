
objects = [];
status = "";
video = "";

var SpeechRecognition = window.webkitSpeechRecognition;
var recognition = new SpeechRecognition();

document.getElementById("status").innerHTML = "Say start to start the video";

function preload() {
  video = createVideo('video.mp4');
  video.hide();
  video.loop();
  video.speed(1);
  video.volume(0);
}
recognition.start();

function setup() {
  canvas = createCanvas(480, 380);
  canvas.position(530,80);

  inputbtn = createFileInput(handlefile);
  inputbtn.position(200,100);
  
  
}
recognition.onresult = function(event) {
  console.log(event); 

  var content = event.results[0][0].transcript;

  document.getElementById("status").innerHTML = "The Speech has been recognized as: " + content; 
    if(content == "start"){
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "Status : Detecting Objects, say stop to stop the video";
  }
   if(content == "stop"){
    video.stop();
    status=false;
    document.getElementById("number_of_objects").innerHTML = "";
    document.getElementById("status").innerHTML = "Status : Video stopped! Choose another video";
    
  }
  
}
function handlefile(file){

  console.log("handlefile, file type : ",file.type);
  if(file.type == 'video'){
    clear();
    video = createVideo(file.data);
    draw();
    video.hide();
    video.loop();
    video.speed(1);
    video.volume(0);
    recognition.start();

  }
  else{
    video = null;
  }
}


function modelLoaded() {
  console.log("Model Loaded!");
  status = true;

}

function gotResult(error, results) {
  if (error) {
    console.log(error);
  }
  console.log(results);
  objects = results;
  recognition.start();
}


function draw() {
  image(video, 0, 0, 480, 380);
  if (status != "") {
    objectDetector.detect(video, gotResult);
    for (i = 0; i < objects.length; i++) {
      document.getElementById("status").innerHTML = "Status : Objects Detected";
      document.getElementById("number_of_objects").innerHTML = "Number of objects detected are : " + objects.length;

      fill("#FF0000");
      percent = floor(objects[i].confidence * 100);
      text(objects[i].label + " " + percent + "%", objects[i].x + 15, objects[i].y + 15);
      noFill();
      stroke("#FF0000");
      rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
    }
  }
}
