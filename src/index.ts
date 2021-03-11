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
  isPlaying;
  muteBtns;
  tempoSlider;

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
    this.isPlaying = 0;
    this.muteBtns = document.querySelectorAll(
      '.mute'
    ) as NodeListOf<HTMLElement>;
    this.tempoSlider = document.querySelector(
      '.tempo-slider'
    ) as HTMLInputElement;
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
   * Clear interval
   */
  clearPlayInterval() {
    clearInterval(this.isPlaying);
    this.isPlaying = 0;
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
      this.clearPlayInterval();
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

  /**
   * Mute and unmute sounds
   * @param e
   */
  mute(e: Event) {
    const target = e.target as HTMLSelectElement;
    const muteIndex = target.getAttribute('data-track');
    target.classList.toggle('active');
    if (target.classList.contains('active')) {
      switch (muteIndex) {
        case '0':
          this.kickSound.volume = 0;
          break;
        case '1':
          this.snareSound.volume = 0;
          break;
        case '2':
          this.hihatSound.volume = 0;
          break;
        default:
          return;
      }
    } else {
      switch (muteIndex) {
        case '0':
          this.kickSound.volume = 1;
          break;
        case '1':
          this.snareSound.volume = 1;
          break;
        case '2':
          this.hihatSound.volume = 1;
          break;
        default:
          return;
      }
    }
  }

  /**
   * Change text value of tempo
   * @param e 
   */
  changeTempo(e: Event) {
    const { value } = e.target as HTMLSelectElement;
    const tempoText = document.querySelector('.tempo-nr') as HTMLElement;
    tempoText.innerHTML = value;
  }

  /**
   * Update beat per minute tempo for sound
   * @param e 
   */
  updateTempo(e: Event) {
    const { value } = e.target as HTMLSelectElement;
    // Set new beat value
    this.beatsPerMinute = parseInt(value);

    // Clear interval
    this.clearPlayInterval();

    // Continue playing if the sound is playing
    if(this.playButton.classList.contains('active')){
      this.play();
    }
  }
}

const drumKit = new DrumKit();

drumKit.addOptions();

// Events

drumKit.pads.forEach((pad) => {
  pad.addEventListener('click', drumKit.activePad);
  pad.addEventListener('animationend', () => {
    pad.style.animation = '';
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

drumKit.muteBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    drumKit.mute(e);
  });
});

drumKit.tempoSlider.addEventListener('input', (e) => {
  drumKit.changeTempo(e);
});

drumKit.tempoSlider.addEventListener('change', (e) => {
  drumKit.updateTempo(e);
});
