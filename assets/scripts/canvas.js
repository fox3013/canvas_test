//常用变量
var canvas, cc, centerX, centerY,dth, drawHeight, innerRadius, arcStep, frameRenderer, isAnimationFinished, animStartTime, animationProgress;
var snap1, snap2, drop, circ1, circ2, o1, o2;
var angleOffset = -Math.PI/2.0;
var sectionAngle = Math.PI/5.0;
var pieAngle = sectionAngle*7.0;
//data
var data = {
  name: ["CRM管理系统", "4A运维系统", "4A主机操作","应用金库管理日志","BOMC系统", "4A数据库操作","SSO单点登入"],
  value: [6.3, 1.5, 1, 0.28, 0.15, 0.25, 0.5],
  color: ["#d62e64", "#1b8cc7", "#4b6fb4", "#44b193", "#f2da65", "#9d4c99", "#d85e65"]
};
var ruler = ['0', '6,000,000', '12,000,000', '18,000,000', '24,000,000', '30,000,000', '36,000,000'];
var imagesSrcs = {imgCore: 'img-core.png', icn0: 'icn-0.png', icn1: 'icn-1.png', icn2: 'icn-2.png', icn3: 'icn-3.png', icn4: 'icn-4.png', icn5: 'icn-5.png', icn6: 'icn-6.png'};


//Animation parameters
//TODO: 处理动态fps
var fps = 60.0;

var animScript = {
  core: {invoke: 0, duration: 0.5},
  iconRing: {invoke: 0.6, duration: 0.3},
  catName: {invoke: 1.1, duration: 0.3},
  sec0: {invoke: 1.3, duration: 0.8},
  sec1: {invoke: 1.5, duration: 0.8},
  sec2: {invoke: 1.7, duration: 0.8},
  sec3: {invoke: 1.9, duration: 0.8},
  sec4: {invoke: 2.1, duration: 0.8},
  sec5: {invoke: 2.3, duration: 0.8},
  sec6: {invoke: 2.5, duration: 0.8},
  fan: {invoke: 2.9, duration: 0.8},
  rulerText: {invoke: 3.5, duration: 0.6}
};

function updateAnimationProgress(){
  //未到为－1， 正常取值 0－1，结束为99
  if (animStartTime == undefined) {
    animStartTime = Date.now();
  }
  var time = (Date.now() - animStartTime)/1000.0;
  animationProgress = {finished:true};

  for (var key in animScript) {
    var progress = -1;
    var invoke = animScript[key]['invoke'];
    var duration = animScript[key]['duration'];
    if (time < invoke) {
      //not yet
      progress = -1;
    }else if (time > invoke + duration) {
      //finished
      progress = 99;
    }else {
      //animating
      localTime = time - invoke;
      progress = localTime/duration;
    }
    animationProgress[key] = progress;
    if (progress < 1) {
      animationProgress.finished = false;
    }
  };
}

function updateData(){
  for (var i = 0; i < 7; i++) {
    var id = "input#data" + i;
    if ($(id).count>0 && $(id).value >= 0) {
      data.value[i] = document.getElementById(id).value/6000000;
    }
  };
}

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var isAnimationFinished = true;
var loadedImages;

//TODO: 处理Retina屏
window.onload = function(){
  canvas = document.getElementById("newCanvas");
  cc = canvas.getContext("2d");

  centerX = canvas.width / 2.0;
  centerY = canvas.height / 2.0;
  drawWidth = canvas.width*0.87;
  drawHeight = canvas.height*0.8;

  drawDots();
  drop.attr({
    fill: "#0B8BC7",
  })

  loadImages(imagesSrcs, function(images) {
    loadedImages = images;
    beginAnimation();
  });
};

function beginAnimation(){
  animStartTime = Date.now();
  cc.clearRect(0, 0, canvas.width, canvas.height);
  updateData();
  if (isAnimationFinished) {
    isAnimationFinished = false;
    renderLoop();
  }
}

function renderLoop(){
  if (!isAnimationFinished) {
    drawData();
    frameRenderer = requestAnimationFrame(renderLoop);
  }else {
    $(".fadeUpIn").addClass("fadeUpInDo");
    setTimeout(function(){playDropAnim()},2200);
    setTimeout(function(){playDotAnim(circ1, circ2)},2500);
  }
}

//绘制数据动画帧
function drawData(){
  cc.clearRect(0, 0, canvas.width, canvas.height);
  //更新各动画脚本时间
  updateAnimationProgress();

  //canvas 变量
  innerRadius = 0.276*drawWidth; //原始 207
  arcStep = 0.0294*drawWidth; //22

  //绘制背景
  // cc.globalAlpha = 1;
  // cc.fillStyle = "#26273F";
  // cc.fillRect(0, 0, canvas.width, canvas.height);

  //绘制表格背景
  if (animationProgress.fan >= 0) {
    var progress = Curves.easeOutQuad(Math.min(animationProgress.fan, 1));
    cc.beginPath();
    var bgOuterR = innerRadius + 4*arcStep + arcStep/6.0;
    var bgInnerR = innerRadius - 0.0162*drawWidth;
    cc.arc(centerX, centerY, bgOuterR, pieAngle + angleOffset, pieAngle * (1-progress) + angleOffset, true);
    //cc.lineTo(centerX, centerY - bgInnerR);
    cc.arc(centerX, centerY, bgInnerR, pieAngle * (1-progress) + angleOffset, pieAngle + angleOffset, false);
    cc.closePath();
    cc.fillStyle = "#3f4a69"
    cc.fill();
    cc.save();
  }


  //绘制数据
  var dataAngleStart = angleOffset;
  for (var i = 0; i < data.value.length; i++) {
    var dataAngleTo = dataAngleStart + sectionAngle;
    var animationName = "sec" + i;
    if (animationProgress[animationName] > 1) {
      //动画结束
      var dataOuterR = innerRadius + data.value[i]*arcStep;
      var dataInnerR = innerRadius;
      cc.beginPath();
      cc.arc(centerX, centerY, dataOuterR, dataAngleStart, dataAngleTo, false);
      cc.arc(centerX, centerY, dataInnerR, dataAngleTo, dataAngleStart, true);
      cc.closePath();
      cc.fillStyle = data.color[i];
      cc.fill();
    }else if (animationProgress[animationName] >= 0) {
      //动画中
      var animProg = animationProgress[animationName];
      animProg = Curves.easeOutQuad(animProg);
      curvedProg = Math.min(- Math.cos(animProg * Math.PI)/2.0 + 0.5, 1);
      var dataOuterR = innerRadius + data.value[i]*arcStep  * curvedProg;
      var dataInnerR = innerRadius;
      cc.beginPath();
      cc.arc(centerX, centerY, dataOuterR, dataAngleStart, dataAngleTo, false);
      cc.arc(centerX, centerY, dataInnerR, dataAngleTo, dataAngleStart, true);
      cc.closePath();
      cc.fillStyle = data.color[i];
      cc.fill();
    }
    dataAngleStart = dataAngleTo;
  };
  cc.save();

  //绘制弧形刻度
  if (animationProgress.fan >= 0) {
    var progress = Curves.easeOutQuad(Math.min(1, animationProgress.fan));
    for (var i = 1; i < 7; i++) {
      cc.beginPath();
      cc.arc(centerX, centerY, innerRadius + i*arcStep, pieAngle * (1-progress) + angleOffset, pieAngle + angleOffset, false);
      cc.lineWidth = 0.5;
      cc.strokeStyle = "rgba(255,255,255,0.3)";
      cc.stroke();
    };
    cc.save();
  }



  //绘制刻度数字
  if (animationProgress.rulerText >= 0) {
    var rulerTextProg = animationProgress.rulerText;
    cc.textAlign = 'right';
    cc.fillStyle = 'rgba(255,255,255,0.5)';
    cc.font = "110% STXihei";
    for (var i = 0; i < ruler.length; i++) {
      var reversedIdx = ruler.length - i;
      var singleProg = 1/(ruler.length);
      var alpha = Math.max(0, (rulerTextProg - reversedIdx*singleProg) /singleProg);
      cc.globalAlpha = Math.min(alpha, 1);

      var rulerX = centerX - 0.02*drawWidth;
      var rulerY = centerY - (innerRadius + i*arcStep - 0.0067*drawWidth);
      cc.fillText(ruler[i], rulerX, rulerY);
    };
    cc.globalAlpha = 1;
    cc.save();
  }

  //类别名称背景
  if (animationProgress.catName >= 0) {
    var prog = Math.min(animationProgress.catName, 1);
    cc.globalAlpha = prog;
    var nameRingOffset = (1 - Curves.easeOutBack(prog)) * drawWidth * 0.1;
    var categoryRadius = 0.24*drawWidth - nameRingOffset;
    var ringWidth = 0.04*drawWidth;
    cc.beginPath();
    cc.arc(centerX, centerY, categoryRadius, 0, Math.PI*2, false);
    cc.strokeStyle = "#3B597C";
    cc.lineWidth = ringWidth;
    cc.stroke()
    cc.save();
  }

  //类别名称文字
  cc.font = "86% STXihei";
  cc.fillStyle = "#ffffff";
  cc.textAlign = 'left';
  var lastSecName = "sec6";
  if (animationProgress[lastSecName]>=1) {
    cc.fillTextCircle(data.name,centerX,centerY,0.23*drawWidth, 0);
    cc.save();
  }else{
    for (var i = 0; i < data.value.length; i++) {
      text = [data.name[i]];
      var animationName = "sec" + i;
      if (animationProgress[animationName] > 1) {
        cc.fillTextCircle(text,centerX,centerY,0.23*drawWidth, i*sectionAngle);
      }else if (animationProgress[animationName]>=0) {
        cc.globalAlpha = animationProgress[animationName];
        cc.fillTextCircle(text,centerX,centerY,0.23*drawWidth, i*sectionAngle);
      }
      cc.globalAlpha = 1;
    };
  }

  //类别图标
  if (animationProgress.iconRing >= 0) {
    cc.fillStyle = "#537797";
    var prog = Math.min(animationProgress.iconRing, 1);
    var curvedProg = Curves.easeOutBack(prog);
    cc.globalAlpha = prog;

    var iconOffset = (1 - curvedProg) * drawWidth * 0.1;
    var iconOutRadius = Math.max(0.2 * drawWidth - iconOffset, 0);
    var iconInnerRadius = Math.max(0.15333 * drawWidth - iconOffset,0);
    var iconPadding = 0.004;
    var iconWidth = 0.0333 * drawWidth;
    var iconRadius = (iconOutRadius + iconInnerRadius + iconWidth)/2.0;
    for (var i = 0; i < data.value.length; i++) {


      var startAng = angleOffset + i*sectionAngle + iconPadding;
      var endAng = angleOffset + (i + 1)*sectionAngle - 2*iconPadding;
      cc.beginPath();
      cc.arc(centerX, centerY, iconOutRadius, startAng, endAng, false);
      cc.arc(centerX, centerY, iconInnerRadius, endAng, startAng, true);
      cc.closePath();
      cc.fill();
      cc.save();

      cc.translate(centerX,centerY);
      cc.rotate((i + 0.5)*sectionAngle);
      cc.drawImage(loadedImages['icn'+i], -iconWidth/2.0, - iconRadius, iconWidth, iconWidth);
      cc.restore();

    };

  }

  //中部的环
  if (animationProgress.core >= 0) {
    var prog = Math.min(animationProgress.core,1);
    cc.globalAlpha = Curves.easeInQuart(prog);
    var coreOffset = -Curves.easeInQuad(1-prog)*drawWidth*0.03;
    var coreImgX = centerX - 0.51178*drawWidth + coreOffset;
    var coreImgY = centerY - 0.3388*drawWidth;
    var coreImgWidth = 0.64267*drawWidth;
    var coreImgHeight = 0.4706*drawWidth;
    cc.drawImage(loadedImages.imgCore, coreImgX, coreImgY, coreImgWidth, coreImgHeight);
    cc.save();
  }

  if (animationProgress.finished) {
    isAnimationFinished = true;
    window.cancelAnimationFrame(frameRenderer);//does not work
    frameRenderer = 0;
  }
}

function drawDots(){
  snap1 = Snap("#snap1");
  var width = 440;
  var height = 220;
  snap1.attr({ viewBox: "0 0 " + width + " " +height })
  dpath1 = "M205,67A98,98,0,1,0,205,154C205,154,211,142,211,142A98,98,0,0,0,211,81C211,81,205,67,205,67Z";
  drop = snap1.path(dpath1);
  //circ1.transform("s.4");

  snap2 = Snap("#snap2");
  snap2.attr({ viewBox: "0 0 " + width + " " +height })
  var paddingLeft = (width - width/1.2)/2;
  var paddingRight = paddingLeft;
  var r1 = 0.18*width;
  var r2 = r1*0.5858;
  o1 = {x: paddingLeft + r1, y: height*0.5};
  o2 = {x: width - paddingRight - r2, y: height*0.5}
  circ1 = snap2.circle(o1.x,o1.y, r1);
  circ2 = snap2.circle(o2.x,o2.y, r2);
  circ1.attr({
    fill: "#d63464",
  });
  circ2.attr({
    fill: "#d63464"
  });
  circ1.transform("s.0");
  circ2.transform("s.0");
}

function playDropAnim(ele){
  dpath2 = "M205,67A98,98,0,1,0,205,154C210,150,270,90,329,140A48,48,0,1,0,329,81C270,131,210,71,205,67";
  drop.animate({d: dpath2}, 800, Curves.easeOutElasticMin);

}

function playDotAnim(c1, c2){
  c1.animate({transform: "s1,"+ o1.x + "," + o1.y}, 400, Curves.easeOutElastic, function(){
    c2.animate({transform:"s1," + (o2.x-o1.x) + "," + (o2.y-o1.y) + "s1," + o2.x + "," + o2.y} , 400, Curves.easeOutElastic, function(){

    });
  });
}

//图像载入
function loadImages(sources, callback) {
    var images = {};
    var loadedImageCount = 0;
    var numImages = 0;
    // get num of sources
    for(var src in sources) {
      numImages++;
    }
    for(var src in sources) {
      url = "./assets/images/" + sources[src];
      images[src] = new Image();
      images[src].onload = function() {
        if(++loadedImageCount >= numImages) {
          callback(images);
        }
      };
      images[src].src = url;
    }
  }



//圆形文字绘制（类别名称）
CanvasRenderingContext2D.prototype.fillTextCircle = function(names,x,y,radius,startRotation){
  if (names.length < 2 || data.textWidth.length < 2) {
    data.textWidth = [];
    data.charWidths = [];
  }else {
    data.textWidth = data.textWidth || [];
    data.charWidths = data.charWidths || [];
  }

  for (var i = 0; i < names.length; i++) {
    text = names[i];
    if (data.textWidth.length< i + 1) {
      //计算文字总宽度
      data.textWidth[i] = this.measureText(text).width;
      data.charWidths[i] = [];
      //每个字的宽度
      for (var j = 0; j < text.length; j++) {
        data.charWidths[i].push(this.measureText(text[j]).width);
      }
    }

    this.save();
    this.translate(x,y);
    this.rotate(startRotation + i * sectionAngle);
    //文字宽度常数
    var c = radius * 0.000035;
    //每个section中第一个文字的起始角度
    var accumulatedRotation = (sectionAngle - c * data.textWidth[i])/2.0;
    for (var j = 0; j < text.length; j++) {
      this.save();
      if (j>0) {
        accumulatedRotation += c * data.charWidths[i][j-1];
      }
      this.rotate(accumulatedRotation);
      this.fillText(text[j], 0, -radius);
      this.restore();
    }
    this.restore();
  };
}
