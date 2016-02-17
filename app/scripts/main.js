//Setting Up Canvas
var canvas = new fabric.Canvas('c', {
  selectionColor: 'blue',
  selectionLineWidth: 2,
  width: 800,
  height: 600
  // ...
});
console.log(canvas);
var container = document.getElementById('artboard');
var paintArea = document.getElementById('canvas');
// canvas.wrapperEl.style.transform = "scale(.8)";
artboardScale();
function artboardScale() {
  var aspectRatio = canvas.width/canvas.height;
  var ratioW = canvas.width/container.clientWidth,
      ratioH = canvas.height/container.clientHeight;

  console.log('W:' + ratioW);
  console.log('H:' + ratioH);
  var motive;
  if (ratioW >= ratioH) {
    if (ratioW > 1) {
      ratioW = container.clientWidth/canvas.width;
      motive = ratioW*ratioW;
      console.log(ratioW);
      if (motive > 1) {
        motive = 1;
      }
      paintArea.style.transform = "scale(" + motive + ")";
      paintArea.style.transformOrigin = "25% 25%";
    } else {
      motive = 1;
      paintArea.style.transform = "scale(" + motive + ")";
      paintArea.style.transformOrigin = "25% 25%";
    }
  } else if (ratioW < ratioH){
    if (ratioH > 1) {
      ratioH = container.clientHeight/canvas.height;
      motive = ratioH*ratioH;
      console.log(ratioH);
      if (motive > 1) {
        motive = 1;
      }
      paintArea.style.transform = "scale(" + motive + ")";
      paintArea.style.transformOrigin = "45% 25%";
    } else {
      motive = 1;
      paintArea.style.transform = "scale(" + motive + ")";
      paintArea.style.transformOrigin = "25% 25%";
    }
  }
}


//aspectRatio

$(window).resize(function(){
  artboardScale();
})
// Canvas container scaling
// var container = document.getElementById('artboard');
// var paintArea = document.getElementById('canvas');
// console.log(container.clientHeight);
// artboardScale();
// function artboardScale() {
//   //Check Aspect
//   var aspectRatio = paintArea.clientWidth/paintArea.clientHeight;
//   var wide,
//       long;

//   if (aspectRatio > 1) {

//   } else {

//   }

//   if ($('.canvas-container').outerWidth() > container.clientWidth || $('.canvas-container').outerHeight() > container.clientHeight) {
//     console.log(paintArea);
//     var ratio = container.clientWidth/paintArea.clientWidth;
//     console.log(ratio);
//     var motive = ratio*ratio;
//     paintArea.style.transform = "scale(" + motive + ")";
//   }else if ($('.canvas-container').outerWidth() < container.clientWidth || $('.canvas-container').outerHeight() < container.clientHeight) {
//     console.log(paintArea);
//     var ratio = container.clientWidth/paintArea.clientWidth;
//     console.log(ratio);
//     var motive = ratio*ratio;
//     if (motive > 1) {
//       motive = 1;
//     }
//     paintArea.style.transform = "scale(" + motive + ")";
//   }
// }
// $(window).resize(function(){
//   artboardScale();
// })

//Listener
$("#widthValue").on("change paste keyup", function() {
   //Refresh Canvas Size
   canvas.setWidth($(this).val());
   canvas.renderAll();
   //Fit Artboard
   artboardScale();
});

$("#heightValue").on("change paste keyup", function() {
   //Refresh Canvas Size
   canvas.setHeight($(this).val());
   canvas.renderAll();
   //Fit Artboard
   artboardScale();
});

$("#canvas-select").change(function(){
  //Refresh Canvas Size
  var presetWidth = $('#canvas-select option:selected').attr('data-width'),
      presetHeight = $('#canvas-select option:selected').attr('data-height');
  $("#widthValue").val(presetWidth);
  $("#heightValue").val(presetHeight);
  canvas.setWidth(presetWidth);
  canvas.setHeight(presetHeight);
  canvas.renderAll();
  //Fit Artboard
  artboardScale();
  //Set Canvas tip tags
  $(".sizeTag .tag.width span").html(presetWidth);
  $(".sizeTag .tag.height span").html(presetHeight);
})



//Refresh canvas size

// // Select
// rect.on('selected', function() {
//   console.log('selected a rectangle');
// });
// //Scaling
// rect.on('scaling', function() {
//   console.log('scaling');
// });
// //Moving
// rect.on('moving', function() {
//   console.log('moving');
// });

var initRadius = 100;

var Artboard = {
  addRect : function(){
    var rect = new fabric.Rect({
      left: canvas.getWidth()/2-initRadius/2,
      top: canvas.getHeight()/2-initRadius/2,
      fill: 'rgba(0,0,0,0.33)',
      width: initRadius,
      height: initRadius
    });
    rect.perPixelTargetFind = true;
    canvas.add(rect);
    //Bind
    bindEvents(rect);
    //Refresh log
    logObj();
  },
  addCircle : function(){
    var circle = new fabric.Circle({
      left: canvas.getWidth()/2-initRadius/2,
      top: canvas.getHeight()/2-initRadius/2,
      fill: 'rgba(0,0,0,0.33)',
      radius: initRadius/2
    });
    circle.perPixelTargetFind = true;
    canvas.add(circle);
    //Bind
    bindEvents(circle);
    //Refresh log
    logObj();
  },
  addTriangle : function(){
    var triangle = new fabric.Triangle({
      left: canvas.getWidth()/2-initRadius/2,
      top: canvas.getHeight()/2-initRadius/2,
      fill: 'rgba(0,0,0,0.33)',
      width: initRadius,
      height: initRadius
    });
    //Set Perpixel Movement
    triangle.perPixelTargetFind = true;
    canvas.add(triangle);
    //Bind
    bindEvents(triangle);
    //Refresh log
    logObj();
  },
  addVideo : function() {
    //Set InitRadius for Videos 16:9
    var w = initRadius*1.6;
    var h = initRadius*0.9;
    var videoEl = document.createElement("video");
    videoEl.loop = true;
    videoEl.controls = true;
    console.log(videoEl);
    videoEl.innerHTML = '<source src="http://www.quirksmode.org/html5/videos/big_buck_bunny.mp4">';

    var video = new fabric.Image(videoEl, {
      left: canvas.getWidth()/2-w/2,
      top: canvas.getHeight()/2-h/2,
      angle: 0,
      width: w,
      height: h
    });
    // video.crossOrigin = "";
    // video.perPixelTargetFind = true;
    canvas.add(video);
    video.getElement().play();

    //Bind
    bindEvents(video);
    //Refresh log
    logObj();

    fabric.util.requestAnimFrame(function render() {
      canvas.renderAll();
      fabric.util.requestAnimFrame(render);
    });
  },
  dispose : function() {
    // canvas.deactivateAllWithDispatch();
    canvas.clear();
    //Refresh log
    logObj();
  },
  removeObject: function() {
    canvas.getActiveObject().remove();
  }
}

//Get Objects
canvas.getObjects();
//Information
console.log(canvas.getWidth());

//Bind
$('.tools').on('click', 'a', function(){
  var className = $(this).attr('class');
  switch(className){
    case 'js-add-rect':
      Artboard.addRect();
      break;
    case 'js-add-circle':
      Artboard.addCircle();
      break;
    case 'js-add-triangle':
      Artboard.addTriangle();
      break;
    case 'js-dispose':
      Artboard.dispose();
      break;
    case 'js-add-video':
      Artboard.addVideo();
  }
})
$('.objectControl').on('click', 'button', function(){
  var className = $(this).attr('class');
  switch(className){
    case 'js-delete':
      Artboard.removeObject();
      break;
  }
})

function bindEvents(obj) {
  obj.on('selected', function() {
    console.log('selected');
    $('.objectControl').addClass('active');
    instantMeta(obj);
  });
  //deselect
  canvas.on('before:selection:cleared', function() {
    console.log('deselected');
    $('.objectControl').removeClass('active');
    instantMeta(obj);
  });

  //Scaling
  obj.on('scaling', function() {
    console.log('scaling');
    instantMeta(obj);
  });
  //Moving
  obj.on('moving', function() {
    console.log('moving');
    instantMeta(obj);
  });
  //Rotating
  obj.on('rotating', function() {
    console.log('rotating');
    instantMeta(obj);
  });
}

function instantMeta(obj) {
  console.log(obj);
  var width,
      height,
      radius,
      left,
      top,
      angle,
      type;

  width = obj.width*obj.scaleX;
  height = obj.height*obj.scaleY;
  radius = obj.radius;
  left = obj.left;
  top = obj.top;
  angle = obj.angle;
  type = obj.type;

  $('.attributes .type span').html(type);
  $('.attributes .width span').html(width);
  $('.attributes .height span').html(height);
  $('.attributes .radius span').html(radius);
  $('.attributes .angle span').html(angle);
  $('.attributes .position .top span').html(top);
  $('.attributes .position .left span').html(left);
}

function logObj() {
  $('#console .shapeobj .content').html(JSON.stringify(canvas.toJSON()));
  $('#console .canvasobj .content').html(JSON.stringify(canvas));

  // fabric.log(canvas.toJSON());
}
