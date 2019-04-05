/* INTERFACES */
interface DefaultSettings {
  writeDelay: number;
  deleteDelay: number;
  holdOnceWritten: number;
  holdOnceDeleted: number;
  stopAfterOnce: boolean;
}
interface CustomSettings {
  writeDelay?: number;
  deleteDelay?: number;
  holdOnceWritten?: number;
  holdOnceDeleted?: number;
  stopAfterOnce?: boolean;
}


//default settings
const typewriterSettings: DefaultSettings = {
  writeDelay: 80,
  deleteDelay: 40,
  holdOnceWritten: 1000,
  holdOnceDeleted: 300,
  stopAfterOnce: false
};


class TypewriterProps {
  protected settings: CustomSettings;
  protected element: HTMLElement;
  protected phrases: string[];
  protected currentPhrase: number = 0;
  
  constructor(selector: string, phrases: string[], settings: CustomSettings) {
    this.settings = settings;
    this.element = document.querySelector('#zipcodeInput') as HTMLElement;
    this.phrases = phrases;
  }
}

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

