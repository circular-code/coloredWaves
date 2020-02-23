function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getRandomRGB(r,g,b) {
   return 'rgba(' + Math.random() * r + ',' + Math.random() * g + ',' + Math.random() * b + ',0.3)';
}

var gui = {
    amplitude: Math.random() * 200,
    waveLength: Math.random() / 100,
    frequency: Math.random() * 1,
};

document.getElementById('amplitude').addEventListener('change', function(e){
    gui.amplitude = Math.random() * +e.srcElement.value;
});

document.getElementById('frequency').addEventListener('change', function(e){
    gui.frequency = Math.random() * +e.srcElement.value / 10;
});

document.getElementById('waveLength').addEventListener('change', function(e){
    gui.waveLength = Math.random() / +e.srcElement.value;
});

function runAnimation(target) {
    'use strict';

    var canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    target.append(canvas);
    canvas.width = target.clientWidth;
    canvas.height = target.clientHeight;
    ctx.lineWidth = 2;

    // adjust to vertical scrollbar
    var width = window.document.body.clientWidth < canvas.width ? window.document.body.clientWidth : canvas.width;

    window.addEventListener('resize', function() {
        canvas.width = target.clientWidth;
        canvas.height = target.clientHeight;
    });

    class Wave {
        constructor (x, y, waveLength, amplitude, color, frequency) {
            this.x = x;
            this.y = y;
            this.waveLength = waveLength;
            this.amplitude = amplitude;
            this.color = color;
            this.frequency = frequency;
            this.moveBy = 0;
        }

        draw () {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + Math.sin(this.x * (this.waveLength + gui.waveLength) + this.moveBy) * (this.amplitude + gui.amplitude) * Math.sin(this.moveBy));

            for (let i = 0; i < width; i++)
                ctx.lineTo(i, this.y + Math.sin(i * (this.waveLength + gui.waveLength) + this.moveBy) * (this.amplitude + gui.amplitude) * Math.sin(this.moveBy));

            ctx.strokeStyle = this.color;
            ctx.stroke();
        }

        move (timeDelta) {
            this.moveBy += (this.frequency + gui.frequency) * timeDelta;
        }
    }

    var waves = [];
    for (let i = 0, amount = 10; i < amount; i++)
        waves.push(new Wave(0, canvas.height/2, Math.random() / 250, Math.random() * 200, getRandomRGB(255,0,125) , Math.random()));

    var time = Date.now();

    function renderLoop(now = Date.now()) {

        var timeDelta = (now - time) / 1000;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //prevent huge jumps of dot movement when leaving site
        if (timeDelta >= 0.05 || timeDelta <= 0)
            timeDelta = 0.01;

        waves.forEach(wave => (wave.move(timeDelta), wave.draw()));

        time = now;

        requestAnimationFrame(renderLoop);
    }

    renderLoop();
}
