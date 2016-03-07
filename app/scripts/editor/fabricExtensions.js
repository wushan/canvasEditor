fabric.Object.prototype.link = '';

//Create Fabric Video Class
fabric.Video = fabric.util.createClass(fabric.Image, {
	type: 'video',
  initialize: function (element, options) {
            options || (options = {});
            this.callSuper('initialize', options);
            console.log('inittt');

            var videoEl = document.createElement("video");
            videoEl.loop = true;
            videoEl.controls = true;
            console.log(videoEl);
            console.log(element);
            videoEl.innerHTML = '<source src="'+ element +'">';

            this._initElement(videoEl, options);
            this._initConfig(options);

            //Auto Play Video
            videoEl.play();
            fabric.util.requestAnimFrame(function render() {
              canvas.renderAll();
              fabric.util.requestAnimFrame(render);
            });
        },
  toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            media: {
              video: this.media.video
            },
            link: this.link
        });
    },
  _render: function (ctx) {
            this.callSuper('_render', ctx);
        }
});

//Video
fabric.Video.fromURL = function(url, callback, imgOptions) {
    fabric.util.loadImage(url, function(img) {
      callback && callback(new fabric.Video(img, imgOptions));
    }, null, imgOptions && imgOptions.crossOrigin);
  };


fabric.Video.fromObject = function(objects, callback) {
  var v = new fabric.Video(objects.media.video, {
    width: objects.width,
    height: objects.height,
    scaleX: objects.scaleX,
    scaleY: objects.scaleY,
    top: objects.top,
    left: objects.left,
    media: {
      video: objects.media.video
    }
  });
  //Bind
  bindEvents(v);
  //Programmatically Select Newly Added Object
  canvas.setActiveObject(v);
  //Refresh log
  logObj();
  return v;
};

//Create Fabric Slider Class
fabric.Slider = fabric.util.createClass(fabric.Rect, {
  type: 'slider',
  initialize: function (options) {
            options || (options = {});
            this.callSuper('initialize', options);
            console.log('inittt');
        },
  toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            id: this.id,
            fill: this.fill,
            slides: this.slides,
            pattern: this.pattern,
            patternSourceCanvas: this.patternSourceCanvas
        });
    },
  _render: function (ctx) {
            this.callSuper('_render', ctx);
        }
});

//Slider
fabric.Slider.fromArray = function(elements, callback, options) {
  new fabric.Image.fromURL(elements[0].src, function(img) {
    var patternSourceCanvas = new fabric.StaticCanvas();
    console.log(img);
    img.setHeight(patternSourceCanvas.height);
    img.setWidth(patternSourceCanvas.width);
    patternSourceCanvas.setBackgroundImage(img);
    patternSourceCanvas.renderAll();
    console.log(patternSourceCanvas.getElement());
    var pattern = new fabric.Pattern({
      source: patternSourceCanvas.getElement(),
      repeat: 'no-repeat'
    });

    callback && callback(new fabric.Slider({
      fill: pattern,
      width: img.width,
      height: img.height,
      left: options.left,
      top: options.top,
      slides: elements,
      id: generator.generate(),
      pattern: pattern,
      patternSourceCanvas: patternSourceCanvas
    }));
  }, null, options && options.crossOrigin);
}

fabric.Slider.fromObject = function(objects, callback) {
  // var pattern = new fabric.Pattern({
  //       source: objects.patternSourceCanvas,
  //       repeat: 'no-repeat'
  //     });
  new fabric.Image.fromURL(objects.slides[0].src, function(oImg) {
    var patternSourceCanvas = new fabric.StaticCanvas();
    oImg.setHeight(patternSourceCanvas.height);
    oImg.setWidth(patternSourceCanvas.width);
    patternSourceCanvas.setBackgroundImage(oImg);
    var pattern = new fabric.Pattern({
        source: patternSourceCanvas.getElement(),
        repeat: 'no-repeat'
      });
    console.log(patternSourceCanvas);
    callback && callback(new fabric.Slider({
      width: objects.width,
      height: objects.height,
      scaleX: objects.scaleX,
      scaleY: objects.scaleY,
      top: objects.top,
      left: objects.left,
      slides: objects.slides,
      fill: pattern,
      id: objects.id,
      pattern: pattern,
      patternSourceCanvas: patternSourceCanvas
    }));
  });
};
fabric.Slider.async = true;


var generator = new IDGenerator();

function IDGenerator() {
	this.length = 8;
	this.timestamp = +new Date;

	var _getRandomInt = function( min, max ) {
		return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
	}

	this.generate = function() {
		var ts = this.timestamp.toString();
		var parts = ts.split( "" ).reverse();
		var id = "";
	 
		for( var i = 0; i < this.length; ++i ) {
		var index = _getRandomInt( 0, parts.length - 1 );
		id += parts[index];	 
		}

		return id;
	}
}

function findObj(id) {
	for(var i=0;i<canvas._objects.length; i++) {
		if (canvas._objects[i].id === id) {
			return canvas._objects[i];
			// console.log(canvas._objects[i]);
		} else {
			console.log(canvas._objects[i]);
		}
	}
	// var i=0;
	// while (i<canvas._objects.length && canvas._objects[i].id === id) {
	// 	console.log(canvas._objects[i]);
	// 	i++;
	// }
	// console.log(canvas);
}
// findObj();

