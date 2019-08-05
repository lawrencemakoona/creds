var startX,
startY,
inputAmount,
currentNode,
context,
canvas,
connecting;
var connections = [];
function reDraw(x1,y1,x2,y2){
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.closePath();
  context.strokeStyle="#333333";
  context.stroke();
  for(var i=0; i < connections.length; i++){
    if(connections[i].active === true) {
     context.beginPath();
      context.moveTo(connections[i].startX, connections[i].startY);
      context.lineTo(connections[i].endX, connections[i].endY);
      context.closePath();
      context.strokeStyle="#2ecc71";
      context.stroke();
    }
  }
}
function startDrag(startX,startY){
  connecting = true;
  $("#flowWrap canvas, #flowWrap li").mousemove(function(e){
     var mouseX = e.pageX - $('#flowWrap').offset().left;
     var mouseY = e.pageY - $('#flowWrap').offset().top;
    reDraw(startX,startY,mouseX,mouseY);
  });
  $("#canvas").click(function(){
      stopDrag(startX,startY);
      jsonOutput();
      connections[currentNode].active = false;
  });
}
function stopDrag(endX,endY){
   $("#flowWrap canvas, #flowWrap li").unbind("mousemove");
   reDraw(startX,startY,endX,endY);
   $("#canvas").unbind("click");
   connecting = false;
}
function inputClick(){
   startX = $(this).offset().left - $("#canvas").offset().left + (1.2* $(this).width());
   startY = $(this).offset().top - $("#canvas").offset().top + (0.5* $(this).height());
   var inputNr = $(this).index();
   currentNode = inputNr;
   connections[inputNr] = {};
   connections[inputNr].startX = startX;
   connections[inputNr].startY = startY;
   startDrag(startX,startY);
}
function outputClick(){
  if(connecting){
    var endX = $(this).offset().left - $("#canvas").offset().left;
    var endY = $(this).offset().top - $("#canvas").offset().top + (0.5* $(this).height());
    connections[currentNode].output = $(this).index();
    connections[currentNode].endX = endX;
    connections[currentNode].endY = endY;
    connections[currentNode].active = true;
    console.log(connections);
    stopDrag(endX,endY);
    jsonOutput();
  }
}
function jsonOutput(){
  var data = {};
  for(var i=0;i<connections.length;i++){
    if(connections[i].active === true) {
      data[i] = connections[i].output;
    }
    else if($("#skip").is(':checked')){
       //Do nothing
    }
    else if ($("#default").is(':checked')) {
      data[i] = i;
    }
    else {
       data[i] = "OFF";
    }
  }
  $("#result").html(JSON.stringify(data, undefined, 2));
}
function init(){
  $(".left li").click(inputClick);
  $(".right li").click(outputClick);
  $("input.option").click(jsonOutput);
  inputAmount = $(".module.left li").length;
  for(var i = 0; i < inputAmount; i++){
     connections[i] =0;
  }
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');
}
function refresh(){
  $(".left li").unbind("click").click(inputClick);
  $(".right li").unbind("click").click(outputClick);
  inputAmount = $(".module.left li").length;
  for(var i = 0; i < inputAmount; i++){
     connections[i] =0;
  }
  var heightL = 3 + (24 * $(".left li").length);
  var heightR = 3 + (24 * $(".right li").length);
  var heightD;
  if(heightL>heightR){
    heightD = heightL;
  } else {
     heightD = heightR;
  }
  $("#canvas, #flowWrap").height( heightD );
  $("#canvas, #flowWrap").width( 600 );
  context.canvas.width = 600;
  context.canvas.height = heightD;
}
function addInput() {
    var number =  $(".left li").length;
    $(".left").append("<li>"+number+"</li>");
    refresh();
}
$(document).ready(function(){
  init();
  $("#add-in").click(addInput);
});
