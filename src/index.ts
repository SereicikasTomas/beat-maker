class DrumKit {
  pads;
  playButton;
  kickSound;
  snareSound;
  hihatSound;
  index;
  beatsPerMinute;

  constructor() {
    this.pads = document.querySelectorAll('.pad') as NodeListOf<Element>;
    this.playButton = document.querySelector('.play') as HTMLElement;
    this.kickSound = document.querySelector('.kick-sound') as HTMLElement;
    this.snareSound = document.querySelector('.snare-sound') as HTMLElement;
    this.hihatSound = document.querySelector('.hihat-sound') as HTMLElement;
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
    const acitveBar = document.querySelectorAll(`.b${step}`);
    this.index++;
    console.log(step);
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
});

drumKit.playButton.addEventListener('click', () => {
  drumKit.play();
});
