//settings
const typewriterSettings = {
    writeDelay: 60,
    deleteDelay: 40,
    holdOnceWritten: 1000,
    holdOnceDeleted: 300 //hold once a phrase has been removed
};
function Typewriter(selector, phrases, settings) {
    this.settings = Object.assign({}, typewriterSettings, settings);
    this.element = document.querySelector(selector);
    this.phrases = phrases;
    try {
      testElementSelector(this.element, selector);
      testPhrases(phrases);
    }
    catch (e) {
      console.error(e);
      return;
    }
    this.currentPhrase = 0;
    this.write = () => {
      // set & clear placeholder attribute
      this.element.setAttribute('placeholder', '');
      // writes the phrase with delay per letter
      this.phrases[this.currentPhrase].split("").forEach((letter, index) => {
        setTimeout(() => {
          this.element.setAttribute(
            "placeholder",
            this.element.getAttribute("placeholder") + letter
          );
          // waits if it's the last letter, then removes the phrase
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
            // removes the letters one by one
            this.element.setAttribute(
              "placeholder",
              this.element.getAttribute("placeholder").slice(0, -1)
            );
            // if all letters have been remove move to a new phrase
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
      }
      this.write();
    };
    this.write();
}
new Typewriter('#zipcodeInput', ['phrase 1', '67', '26'], {writeDelay: 200});
new Typewriter('#zipcodeInputSecond', ['phrase 4', 'test 123', 'test 1248123095781025']);

//tests 
function testElementSelector(element, selector) {
  if (!element || (element.tagName != 'INPUT' && element.tagName != 'TEXTAREA')) {
    throw "You've selected a wrong element with the " + selector;
  }
}
function testPhrases(phrases) {
  let phrasesAmount = phrases.length;
  for (let phraseIndex = 0; phraseIndex < phrasesAmount; phraseIndex++) {
    let phrase = phrases[phraseIndex];
    if (typeof phrase != 'string') {
      throw phrase + ' is not an accepted phrase, it needs to be a string.';
    }
  }
}
