'use strict';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getRandomRGB(r,g,b) {
   return 'rgba(' + Math.random() * r + ',' + Math.random() * g + ',' + Math.random() * b + ',0.3)';
};

function runAnimation(target) {
    var canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    target.append(canvas);
    canvas.width = target.clientWidth;
    canvas.height = target.clientHeight;
    let size = (target.clientWidth + target.clientHeight) / 2;
    canvas.addEventListener("click", mouseClickHandler, false);
    canvas.addEventListener("touchstart", mouseClickHandler, false);

    // adjust to vertical scrollbar
    var width = window.document.body.clientWidth < canvas.width ? window.document.body.clientWidth : canvas.width;

    function mouseClickHandler(e) {

    }

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
            ctx.moveTo(this.x, this.y);

            for (let i = 0; i < width; i++)
                ctx.lineTo(i, this.y + Math.sin(i * this.waveLength + this.moveBy) * this.amplitude * Math.sin(this.moveBy));

            ctx.moveTo(this.x, this.y);

            ctx.strokeStyle = this.color;
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        move (timeDelta) {
            this.moveBy += this.frequency * timeDelta;
        }
    }

    var waves = [];
    for (let i = 0, amount = 6; i < amount; i++)
        waves.push(new Wave(0, canvas.height/2, Math.random() / 100, Math.random() * 300, getRandomRGB(255,0,125) , 0.2));

    var time = Date.now();

    function renderLoop(now) {

        var timeDelta = (now - time) / 1000;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //prevent huge jumps of dot movement when leaving site
        if (timeDelta >= 0.05)
            timeDelta = 0.01;

        waves.forEach(wave => {
            wave.move(timeDelta || 0);
            wave.draw();
        });

        time = now;

        requestAnimationFrame(renderLoop);
    }

    renderLoop();
}
