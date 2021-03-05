class DrumKit {
  pads;
  playButton;
  kickSound;
  snareSound;
  hihatSound;
  index;
  beatsPerMinute;

  constructor() {
    this.pads = document.querySelectorAll('.pad') as NodeListOf<HTMLElement>;
    this.playButton = document.querySelector('.play') as HTMLElement;
    this.kickSound = document.querySelector('.kick-sound') as HTMLMediaElement;
    this.snareSound = document.querySelector(
      '.snare-sound'
    ) as HTMLMediaElement;
    this.hihatSound = document.querySelector(
      '.hihat-sound'
    ) as HTMLMediaElement;
    this.index = 0;
    this.beatsPerMinute = 120;
  }

  activePad(e: Event) {
    const target = e.target as HTMLElement;
    target.classList.toggle('active');
  }

  repeat() {
    // get the remainder so that on the last value it resets to zero
    let step = this.index % (this.pads.length / 3);
    const acitveBars = document.querySelectorAll(
      `.b${step}`
    ) as NodeListOf<HTMLElement>;
    acitveBars.forEach((bar) => {
      bar.style.animation = 'playSound .3s alternate 2 ease';
      if (bar.classList.contains('active')) {
        if (bar.classList.contains('kick-pad')) {
          // Let's the sound play even if the previous one is still playing
          this.kickSound.currentTime = 0;
          this.kickSound.play();
        }
        if (bar.classList.contains('snare-pad')) {
          this.snareSound.currentTime = 0;
          this.snareSound.play();
        }
        if (bar.classList.contains('hihat-pad')) {
          this.hihatSound.currentTime = 0;
          this.hihatSound.play();
        }
      }
    });
    this.index++;
  }

  play() {
    const interval = (60 / this.beatsPerMinute) * 1000;
    setInterval(() => {
      this.repeat();
    }, interval);
  }
}

const drumKit = new DrumKit();

drumKit.pads.forEach((pad) => {
  pad.addEventListener('click', drumKit.activePad);
  pad.addEventListener('animationend', function () {
    this.style.animation = '';
  });
});

drumKit.playButton.addEventListener('click', () => {
  drumKit.play();
});
