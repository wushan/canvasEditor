///////////////////////////////////////
var initRadius = 100;

var Artboard = (function (){
  return {
    addRect : function(){
      var rect = new fabric.Rect({
        left: canvas.getWidth()/2-initRadius/2,
        top: canvas.getHeight()/2-initRadius/2,
        fill: '#'+Math.floor(Math.random()*16777215).toString(16),
        width: initRadius,
        height: initRadius
      });
      rect.toObject = (function(toObject) {
        return function() {
          return fabric.util.object.extend(toObject.call(this), {
            link: this.link
          });
        };
      })(rect.toObject);
      rect.perPixelTargetFind = true;
      canvas.add(rect);
      //Bind
      bindEvents(rect);
      //Programmatically Select Newly Added Object
      canvas.setActiveObject(rect);
      //Refresh log
      logObj();
    },
    addCircle : function(){
      var circle = new fabric.Circle({
        left: canvas.getWidth()/2-initRadius/2,
        top: canvas.getHeight()/2-initRadius/2,
        fill: '#'+Math.floor(Math.random()*16777215).toString(16),
        radius: initRadius/2
      });
      circle.toObject = (function(toObject) {
        return function() {
          return fabric.util.object.extend(toObject.call(this), {
            link: this.link
          });
        };
      })(circle.toObject);
      circle.perPixelTargetFind = true;
      canvas.add(circle);
      //Bind
      bindEvents(circle);
      //Programmatically Select Newly Added Object
      canvas.setActiveObject(circle);
      //Refresh log
      logObj();
    },
    addText : function(){
      var text = new fabric.IText('test',{
        //options
        left: 200,
        top: 200,
        lockScalingX: true,
        lockScalingY: true,
        fontSize: '36'
      })
      text.toObject = (function(toObject) {
        return function() {
          return fabric.util.object.extend(toObject.call(this), {
            link: this.link
          });
        };
      })(text.toObject);
      canvas.add(text);
      //Bind
      bindEvents(text);
      //Programmatically Select Newly Added Object
      canvas.setActiveObject(text);
      //Refresh log
      logObj();
    },
    addMedia : function(objImage) {
      // if (objImage === '' || objImage === undefined) {
      //   //Default image
      //   objImage = 'images/uploads/abc.png';
      // } else {
      // }

      //Check if it is an Slide Array
      if (objImage.length > 1) {
        var imageSet = objImage;
        //If objImage is an Array
        Multimedia.slider(imageSet);
      } else if (objImage.length === 1){
        //Add Image or Video ((Single))
        //extension
        var extension = objImage[0].src.split('.').pop();
        var media;
        var youtubeId = validateYouTubeUrl(objImage[0].src);
        if (youtubeId != false) {
          //If It is from Youtube
          var thumbnail = getThumbnails(youtubeId, function(res){
            console.log(res);
            //Add Single Image
            Multimedia.video(res, youtubeId);
          });
        } else {
          if (extension.match(/^(gif|png|jpg|jpeg|tiff|svg)$/)) {
            //Add Single Image
            Multimedia.image(objImage[0].src);
          } else if (extension.match(/^(mp4|avi|ogg|ogv|webm)$/)) {
            //Add Single Video
            Multimedia.video(objImage[0].src);
          } else {
            console.log('不支援此檔案格式，請重試');
          }
        }
      }
    },
    dispose : function() {
      // canvas.deactivateAllWithDispatch();
      var obj;
      for (var i=0; i<canvas._objects.length; i++) {
        // obj = canvas._objects[i];
        if (canvas._objects[i]._element !== undefined && canvas._objects[i]._element.localName === "video") {
          canvas._objects[i].getElement().pause();
        } else {
          console.log( 'error' );
        }
      }
      canvas.clear();
      //Refresh log
      logObj();
    },
    duplicateObject: function() {
      var obj = canvas.getActiveObject();
      canvas.add(obj.clone());
      canvas.renderAll();
    },
    lockObject: function() {
      var obj = canvas.getActiveObject();
      if (obj.lockMovementY === true) {
        obj.lockMovementY = false;
        obj.lockMovementX = false;
        obj.lockRotation = false;
        obj.lockScalingX = false;
        obj.lockScalingY = false;
      } else {
        obj.lockMovementY = true;
        obj.lockMovementX = true;
        obj.lockRotation = true;
        obj.lockScalingX = true;
        obj.lockScalingY = true;
      }
    },
    removeObject: function() {
      var obj = canvas.getActiveObject();
      if (obj._element !== undefined && obj._element.localName === "video") {
        obj.getElement().pause();
        obj.remove();
      } else {
        obj.remove();
      }

    },
    reset : function() {
      // var size = canvas.getActiveObject().getOriginalSize();
      var obj = canvas.getActiveObject();
      // reset to original size
      obj.setScaleX('1');
      obj.setScaleY('1');
      //align to center of the canvas
      obj.center();
      obj.setCoords();
      canvas.renderAll();
      instantMeta.log(obj);
    }
  }
} ());

//Add Media
var Multimedia = (function (){
  return {
    image : function(source) {
      //Add Single Image
      var media = new fabric.Image.fromURL(source, function(oImg) {
        oImg.set({
          'left': canvas.getWidth()/2-oImg.width/2,
          'top': canvas.getHeight()/2-oImg.height/2
        });
        canvas.add(oImg);
        oImg.center();
        oImg.setCoords();
        oImg.toObject = (function(toObject) {
          return function() {
            return fabric.util.object.extend(toObject.call(this), {
              link: this.link
            });
          };
        })(oImg.toObject);
        // console.log(media);
        canvas.renderAll();
        //Bind
        bindEvents(oImg);
        //Programmatically Select Newly Added Object
        canvas.setActiveObject(oImg);
        //Refresh log
        logObj();
      });
    },
    video : function(source, youtubeId) {
      if ( youtubeId != undefined ) {
        console.log(source);
        var media = new fabric.Video.fromURL(source, function(oImg) {
          oImg.set({
            'left': canvas.getWidth()/2-oImg.width/2,
            'top': canvas.getHeight()/2-oImg.height/2

          });
          media.toObject = (function(toObject) {
            return function() {
              return fabric.util.object.extend(toObject.call(this), {
                link: this.link
              });
            };
          })(media.toObject);
          canvas.add(oImg);
          oImg.center();
          oImg.setCoords();
          // console.log(media);
          canvas.renderAll();
          //Bind
          bindEvents(oImg);
          //Programmatically Select Newly Added Object
          canvas.setActiveObject(oImg);
          //Refresh log
          logObj();
        });
      } else {
        //Add Single Video
        //if is video file
        console.log('match video');
        //Set InitRadius for Videos 16:9
        var vw;
        var vh;
        var video = new fabric.Video(source, {
          media: {
            video: source
          }
        });
        var videoEl = video.getElement();
        canvas.add(video);
        console.log(videoEl);
        console.log(video);
        videoEl.onloadeddata = function() {
          vw = this.videoWidth;
          vh = this.videoHeight;
          video.setWidth(vw);
          video.setHeight(vh);
          video.center();
          video.setCoords();
          canvas.renderAll();
          console.log(this);
          console.log(vw);
          //Auto Play Video
          video.getElement().play();
          video.toObject = (function(toObject) {
              return function() {
                return fabric.util.object.extend(toObject.call(this), {
                  media: {
                    video: source
                  },
                  link : this.link
                });
              };
            })(video.toObject);
          //Bind
          bindEvents(video);
          //Programmatically Select Newly Added Object
          canvas.setActiveObject(video);
          //Refresh log
          logObj();

          fabric.util.requestAnimFrame(function render() {
            canvas.renderAll();
            fabric.util.requestAnimFrame(render);
          });
        };
      }
    },
    slider : function(imageset) {
        var i=0;
        var counter;
        var leastTime;
        var obj;
        //First Image

        //POV
        new fabric.Slider.fromArray(imageset, function(res){
          var patternSourceCanvas = res.patternSourceCanvas;
          var pattern = res.pattern;
          //已建立 slider 物件
          console.log(res);
          console.log(res.toObject());
          canvas.add(res);
          canvas.renderAll();
          // Bind
          bindEvents(res);
          //Programmatically Select Newly Added Object
          canvas.setActiveObject(res);
          res.setCoords();
          //Refresh log
          logObj();
          leastTime = res.slides[0].continued*1000;
          var id = res.id;
          setTimeout(function(){bgRelacer(i,res,id)}, leastTime);
          function bgRelacer(i, res, id) {
            i++;
            if (i === res.slides.length ) {
              i=0;
            }
            obj = findObj(id);
            new fabric.Image.fromURL(res.slides[i].src, function(img){
              // patternSourceCanvas = new fabric.StaticCanvas();
              // console.log(patternSourceCanvas);
              img.setHeight(patternSourceCanvas.height);
              img.setWidth(patternSourceCanvas.width);

              patternSourceCanvas.setBackgroundImage(img);
              patternSourceCanvas.renderAll();
              // patternSourceCanvas.renderAll();
              console.log(patternSourceCanvas.getElement());
              pattern = new fabric.Pattern({
                        source: patternSourceCanvas.getElement(),
                        repeat: 'no-repeat'
                      });

              res.setFill(pattern);
              canvas.renderAll();
            })

            leastTime = res.slides[i].continued*1000;
            setTimeout(function(){bgRelacer(i,res,id)}, leastTime);
          }
      }, {
       left: 150,
       top: 100
      });
    },
    clock : function() {
      //Add Clock Object
    },
    iframe : function() {
      //Get Screen Shot Only
    }
  }
} ());
