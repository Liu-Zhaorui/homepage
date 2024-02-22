"use strict";

$(function() {
    
   //_______________________________BEGIN visualization
    canvas.style.border = "0 solid #CCC";
    var width = canvas.width,height=canvas.height;
    var g = canvas.getContext("2d");
    g.translate(0.5,0.5);
    analyser.fftSize = 256;
    //计算出采样比率44100所需的缓冲区长度
    var length = analyser.frequencyBinCount*44100/context.sampleRate|0;
    //创建数据
    console.log(length);
    var output_f = new Uint8Array(length);

    function update() {
        analyser.getByteFrequencyData(output_f);
        //将缓冲区的数据绘制到Canvas上
        g.clearRect(-0.5,-0.5,width,height);
        g.beginPath(),g.moveTo(0,height);
        var barWidth = (width / length) * 1.25;
        var barHeight;
        var x = 0;
        for(var i = 0; i < length; i++) {
            barHeight = output_f[i]/1.5;
            g.fillStyle = 'rgb(' + (barHeight - 10) + ', 175, 0)';
            g.fillRect(x, height-barHeight/1.5, barWidth, barHeight);

            x += barWidth + 1;
        }
            //请求下一帧
        requestAnimationFrame(update);
        }

    update();
   
    //_______________________________END visualization

});