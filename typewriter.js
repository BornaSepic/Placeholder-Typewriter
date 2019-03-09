//default settings
const typewriterSettings = {
  writeDelay: 80,
  deleteDelay: 40,
  holdOnceWritten: 1000,
  holdOnceDeleted: 300,
  stopAfterOnce: false
};
function TypeWriter(selector, phrases, settings) {
  this.settings = Object.assign({}, typewriterSettings, settings);
  this.element = document.querySelector(selector);
  this.phrases = phrases;
  this.currentPhrase = 0;
  this.write = () => {
    this.element.setAttribute('placeholder', '');
    this.phrases[this.currentPhrase].split("").forEach((letter, index) => {
      setTimeout(() => {
        this.element.setAttribute(
          "placeholder",
          this.element.getAttribute("placeholder") + letter
        );
        if (index === this.phrases[this.currentPhrase].length - 1) {
          setTimeout(() => {
            this.remove();
          }, this.settings.holdOnceWritten);
        }
      }, this.settings.writeDelay * index);
    });
  },
  this.remove = () => {
    let currentWrittenPhrase = this.phrases[this.currentPhrase];
    for (let letterIndex = 0; letterIndex < currentWrittenPhrase.length; letterIndex++) {
      setTimeout(() => {
        this.element.setAttribute(
          "placeholder",
          this.element.getAttribute("placeholder").slice(0, -1)
        );
        if (letterIndex === currentWrittenPhrase.length - 1) {
          setTimeout(() => {
            this.newPhrase();
          }, this.settings.holdOnceDeleted);
        }
      }, this.settings.deleteDelay * letterIndex);
    }
  },
  this.newPhrase = () => {
    this.currentPhrase++;
    if (this.currentPhrase === this.phrases.length) {
      this.currentPhrase = 0;
      if (this.settings.stopAfterOnce) {
        this.element.setAttribute("placeholder", this.phrases[0]);
        return
      }
    }
    this.write();
  };
  this.write();
}

