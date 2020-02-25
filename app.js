function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getRandomRGB(r,g,b) {
   return 'rgba(' + Math.random() * r + ',' + Math.random() * g + ',' + Math.random() * b + ',0.3)';
}

function runAnimation(target, live) {
    'use strict';

    var canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    target.append(canvas);
    canvas.width = target.clientWidth;
    canvas.height = target.clientHeight;
    ctx.lineWidth = 2;
   
    var gui = {
        amplitude: Math.random() * 200,
        waveLength: Math.random() / 100,
        frequency: Math.random() * 1,
        hue: 125,
        saturation: 50,
        lightness: 50,
    };

    if (!live) {
        document.getElementById('amplitude').addEventListener('change', function(e){
            gui.amplitude = Math.random() * +e.srcElement.value;
        });
        document.getElementById('frequency').addEventListener('change', function(e){
            gui.frequency = Math.random() * +e.srcElement.value / 10;
        });
        document.getElementById('waveLength').addEventListener('change', function(e){
            gui.waveLength = Math.random() / +e.srcElement.value;
        });
        document.getElementById('hue').addEventListener('change', function(e){
            gui.hue = +e.srcElement.value;
        });
        document.getElementById('saturation').addEventListener('change', function(e){
            gui.saturation = +e.srcElement.value;
        });
        document.getElementById('lightness').addEventListener('change', function(e){
            gui.lightness = +e.srcElement.value;
        });
    }

    // adjust to vertical scrollbar
    var width = window.document.body.clientWidth < canvas.width ? window.document.body.clientWidth : canvas.width;

    window.addEventListener('resize', function() {
        canvas.width = target.clientWidth;
        canvas.height = target.clientHeight;
    });

    class Wave {
        constructor (x, y, waveLength, amplitude, frequency) {
            this.x = x;
            this.y = y;
            this.waveLength = waveLength;
            this.amplitude = amplitude;
            this.frequency = frequency;
            this.moveBy = 0;
        }

        draw () {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + Math.sin(this.x * (this.waveLength + gui.waveLength) + this.moveBy) * (this.amplitude + gui.amplitude) * Math.sin(this.moveBy));

            for (let i = 0; i < width; i++)
                ctx.lineTo(i, this.y + Math.sin(i * (this.waveLength + gui.waveLength) + this.moveBy) * (this.amplitude + gui.amplitude) * Math.sin(this.moveBy));

            ctx.strokeStyle = `hsl(${gui.hue},${gui.saturation}%,${gui.lightness}%)`;
            ctx.stroke();
        }

        move (timeDelta) {
            this.moveBy += (this.frequency + gui.frequency) * timeDelta;
        }
    }

    var waves = [];
    for (let i = 0, amount = 1; i < amount; i++)
        waves.push(new Wave(0, canvas.height/2, Math.random() / 250, Math.random() * 200, Math.random()));

    var time = Date.now();

    function renderLoop(now = Date.now()) {

        var timeDelta = (now - time) / 1000;

        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //prevent huge jumps of dot movement when leaving site
        if (timeDelta >= 0.05 || timeDelta <= 0)
            timeDelta = 0.01;

        waves.forEach(wave => (wave.move(timeDelta), wave.draw()));

        time = now;

        requestAnimationFrame(renderLoop);
    }

    renderLoop();
}
