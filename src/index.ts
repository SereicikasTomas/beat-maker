const sounds = require('./allSounds/*.wav');

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
  muteBtns;

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
    this.muteBtns = document.querySelectorAll(
      '.mute'
    ) as NodeListOf<HTMLElement>;
  }

  /**
   * Dinamically adds options to selects by types from imported sounds
   */
  addOptions() {
    // Get array of all sound key names
    const soundKeys = Object.keys(sounds);

    // Separate names by types
    const getOptions = (type: string) =>
      soundKeys.filter((sound) => sound.includes(type));
    const kickOptions = getOptions('kick');
    const snareOptions = getOptions('snare');
    const hihatOptions = getOptions('hihat');

    // Removes dash and turns first letter uppercase
    const cleanName = (name: string) =>
      name
        .split('-')
        .map((name) => name[0].toUpperCase() + name.substring(1, name.length))
        .join(' ');

    // Create HTML markup for option node
    const optionMarkup = (src: string, name: string) =>
      `<option value=${src}>${name}</option>`;

    // Inesrt correct options in correct select elements
    this.selects.forEach((element) => {
      switch (element.name) {
        case 'kick-select':
          // Set initial sound to first sound
          this.kickSound.src = sounds[kickOptions[0]];

          // Add option elements
          kickOptions.forEach((option) =>
            element.insertAdjacentHTML(
              'beforeend',
              optionMarkup(sounds[option], cleanName(option))
            )
          );
          break;
        case 'snare-select':
          // Set initial sound to first sound
          this.snareSound.src = sounds[snareOptions[0]];

          // Add option elements
          snareOptions.forEach((option) =>
            element.insertAdjacentHTML(
              'beforeend',
              optionMarkup(sounds[option], cleanName(option))
            )
          );
          break;
        case 'hihat-select':
          // Set initial sound to first sound
          this.hihatSound.src = sounds[hihatOptions[0]];

          // Add option elements
          hihatOptions.forEach((option) =>
            element.insertAdjacentHTML(
              'beforeend',
              optionMarkup(sounds[option], cleanName(option))
            )
          );
          break;
        default:
          return;
      }
    });
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

  /**
   * Change audio src on selection
   * @param e 
   */
  changeSound(e: Event) {
    const { name, value } = e.target as HTMLSelectElement;
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
  }
}

const drumKit = new DrumKit();

drumKit.addOptions();

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
