var DrumKit = /** @class */ (function () {
    function DrumKit() {
        this.pads = document.querySelectorAll('.pad');
        this.playButton = document.querySelector('.play');
        this.currentKick = '../allSounds/kick-classic.wav';
        this.currentSnare = '../allSounds/snare-acoustic01.wav';
        this.currentHihat = '../allSounds/hihat-acoustic01.wav';
        this.kickSound = document.querySelector('.kick-sound');
        this.snareSound = document.querySelector('.snare-sound');
        this.hihatSound = document.querySelector('.hihat-sound');
        this.selects = document.querySelectorAll('select');
        this.index = 0;
        this.beatsPerMinute = 120;
        this.isPlaying = null;
    }
    /**
     * Toggle active pad
     * @param e
     */
    DrumKit.prototype.activePad = function (e) {
        var target = e.target;
        target.classList.toggle('active');
    };
    /**
     * Play sound of all active pads
     */
    DrumKit.prototype.repeat = function () {
        var _this = this;
        // Get the remainder so that on the last value it resets to zero
        var step = this.index % (this.pads.length / 3);
        var acitvePads = document.querySelectorAll(".b" + step);
        // Loop through all the pads
        acitvePads.forEach(function (bar) {
            bar.style.animation = 'playSound .3s alternate 2 ease';
            if (bar.classList.contains('active')) {
                if (bar.classList.contains('kick-pad')) {
                    // Let's the sound play even if the previous one is still playing
                    _this.kickSound.currentTime = 0;
                    _this.kickSound.play();
                }
                if (bar.classList.contains('snare-pad')) {
                    _this.snareSound.currentTime = 0;
                    _this.snareSound.play();
                }
                if (bar.classList.contains('hihat-pad')) {
                    _this.hihatSound.currentTime = 0;
                    _this.hihatSound.play();
                }
            }
        });
        // Update index so it would continue the loop
        this.index++;
    };
    /**
     * Plays the sounds
     */
    DrumKit.prototype.play = function () {
        var _this = this;
        // Set the interval
        var interval = (60 / this.beatsPerMinute) * 1000;
        // Check if it is playing, if not set interval id
        if (!this.isPlaying) {
            this.isPlaying = window.setInterval(function () {
                _this.repeat();
            }, interval);
        }
        else {
            clearInterval(this.isPlaying);
            this.isPlaying = null;
        }
    };
    /**
     * Update play button
     */
    DrumKit.prototype.updatePlayBtn = function () {
        if (!this.isPlaying) {
            this.playButton.innerText = 'Pause';
            this.playButton.classList.add('active');
        }
        else {
            this.playButton.innerText = 'Play';
            this.playButton.classList.remove('active');
        }
    };
    DrumKit.prototype.changeSound = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        console.log(this.kickSound);
        switch (name) {
            case 'kick-select':
                this.kickSound.src = value;
                break;
            case 'snare-select':
                this.snareSound.src = value;
                break;
            case 'hihat-select':
                this.hihatSound.src = value;
                break;
            default:
                return;
        }
        console.log(name, value);
    };
    return DrumKit;
}());
var drumKit = new DrumKit();
// Events
drumKit.pads.forEach(function (pad) {
    pad.addEventListener('click', drumKit.activePad);
    pad.addEventListener('animationend', function () {
        this.style.animation = '';
    });
});
drumKit.playButton.addEventListener('click', function () {
    drumKit.updatePlayBtn();
    drumKit.play();
});
drumKit.selects.forEach(function (select) {
    select.addEventListener('change', function (e) {
        drumKit.changeSound(e);
    });
});
