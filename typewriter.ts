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
  protected settings: DefaultSettings;
  protected element: HTMLElement;
  protected phrases: string[];
  private phrasesLength: number = 0;
  protected currentPhrase: number = 0;

  constructor(selector: string, phrases: string[], settings: CustomSettings) {
    this.settings = { ...typewriterSettings, ...(settings || {}) };
    this.element = document.querySelector(selector) as HTMLElement;
    this.phrases = phrases;
    this.phrasesLength = phrases.length;
  }

  protected updateCurrentPhrase: () => void = () => {
    this.currentPhrase === this.phrasesLength - 1
      ? this.resetPhrases()
      : this.nextPhrase();
  };
  private resetPhrases: () => void = () => {
    this.currentPhrase = 0;
  };
  private nextPhrase: () => void = () => {
    this.currentPhrase++;
  };
}

class TypeWriter extends TypewriterProps {
  constructor(
    selector: string,
    phrases: string[],
    settings: CustomSettings = {}
  ) {
    super(selector, phrases, settings);
    this.write();
  }

  public write: () => void = () => {
    this.element.setAttribute("placeholder", "");
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
  };

  protected remove: () => void = () => {
    let currentWrittenPhrase: string = this.phrases[this.currentPhrase];
    for (
      let letterIndex = 0;
      letterIndex < currentWrittenPhrase.length;
      letterIndex++
    ) {
      setTimeout(() => {
        this.element.setAttribute(
          "placeholder",
          this.element.getAttribute("placeholder")!.slice(0, -1)
        );
        if (letterIndex === currentWrittenPhrase.length - 1) {
          setTimeout(() => {
            this.newPhrase();
          }, this.settings.holdOnceDeleted);
        }
      }, this.settings.deleteDelay * letterIndex);
    }
  };

  protected newPhrase: () => void = () => {
    this.currentPhrase++;
    if (this.currentPhrase === this.phrases.length) {
      this.currentPhrase = 0;
      if (this.settings.stopAfterOnce) {
        this.element.setAttribute("placeholder", this.phrases[0]);
        return;
      }
    }
    this.write();
  };
}
