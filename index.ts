class DrumKit {
  pads;
  playButton;
  currentKick;
  currentSnare;
  currentHihat;
  selects;
  kickSound;
  snareSound;
  hihatSound;
  index;
  beatsPerMinute;
  isPlaying: number | null;

  constructor() {
    this.pads = document.querySelectorAll('.pad') as NodeListOf<HTMLElement>;
    this.playButton = document.querySelector('.play') as HTMLElement;
    this.currentKick = '../allSounds/kick-classic.wav';
    this.currentSnare = '../allSounds/snare-acoustic01.wav';
    this.currentHihat = '../allSounds/hihat-acoustic01.wav';
    this.kickSound = document.querySelector('.kick-sound') as HTMLMediaElement;
    this.snareSound = document.querySelector(
      '.snare-sound'
    ) as HTMLMediaElement;
    this.hihatSound = document.querySelector(
      '.hihat-sound'
    ) as HTMLMediaElement;
    this.selects = document.querySelectorAll(
      'select'
    ) as NodeListOf<HTMLSelectElement>;
    this.index = 0;
    this.beatsPerMinute = 120;
    this.isPlaying = null;
  }

  /**
   * Toggle active pad
   * @param e
   */
  activePad(e: Event) {
    const target = e.target as HTMLElement;
    target.classList.toggle('active');
  }

  /**
   * Play sound of all active pads
   */
  repeat() {
    // Get the remainder so that on the last value it resets to zero
    let step = this.index % (this.pads.length / 3);

    const acitvePads = document.querySelectorAll(
      `.b${step}`
    ) as NodeListOf<HTMLElement>;

    // Loop through all the pads
    acitvePads.forEach((bar) => {
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

    // Update index so it would continue the loop
    this.index++;
  }

  /**
   * Plays the sounds
   */
  play() {
    // Set the interval
    const interval = (60 / this.beatsPerMinute) * 1000;

    // Check if it is playing, if not set interval id
    if (!this.isPlaying) {
      this.isPlaying = window.setInterval(() => {
        this.repeat();
      }, interval);
    } else {
      clearInterval(this.isPlaying);
      this.isPlaying = null;
    }
  }

  /**
   * Update play button
   */
  updatePlayBtn() {
    if (!this.isPlaying) {
      this.playButton.innerText = 'Pause';
      this.playButton.classList.add('active');
    } else {
      this.playButton.innerText = 'Play';
      this.playButton.classList.remove('active');
    }
  }

  changeSound(e: Event) {
    const { name, value } = e.target as HTMLSelectElement;
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
  }
}

const drumKit = new DrumKit();

// Events

drumKit.pads.forEach((pad) => {
  pad.addEventListener('click', drumKit.activePad);
  pad.addEventListener('animationend', function () {
    this.style.animation = '';
  });
});

drumKit.playButton.addEventListener('click', () => {
  drumKit.updatePlayBtn();
  drumKit.play();
});

drumKit.selects.forEach((select) => {
  select.addEventListener('change', (e) => {
    drumKit.changeSound(e);
  });
});
