import Experience from "../Experience";
import EventEmitter from "./EventEmitter";
import textSources from "../textSources";
/**
 * Not my proudest code, things don't get reused, this is not really good usage of
 * a class, will need to be refactor for later usage!
 * At least it should be split between -> options menu and message menu (could extend from something)
 */
export default class TextUtil extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.texts = textSources;
    this.canvas = this.experience.canvas;
    this.container = document.createElement("div");
    this.textDiv = document.createElement("div");
    this.body = document.querySelector("body");
    this.body.appendChild(this.container);
    this.container.classList.add("container", "z-order");
    this.optionsDiv = document.createElement("div");
    this.yesButton = document.createElement("button");
    this.yesButton.innerHTML = "Yes";
    this.currentEffect = null;
    this.isDisplayingFullscreenMessage = false;
    this.currentMessagePart = 0;
    this.totalMessageParts = 0;
    this.currentMessage = null;

    /**
     * Audio
     */
    this.buttonAudioName = "bassAudio";
    this.readAudioName = "paperAudio";
    this.openAudioName = "corkOpenAudio";
    this.audio = {};
    this.canPlaySounds = false;
    this.baseVolume = 1;
  }

  addText(text, effect) {
    this.textDiv.innerHTML = text;
    this.container.appendChild(this.textDiv);
    this.container.classList.remove("z-order");
    this.addOption(effect);
  }

  addOption(effect) {
    this.container.appendChild(this.textDiv);
    this.container.appendChild(this.optionsDiv);
    this.textDiv.classList.add("vt323-regular", "message");
    this.optionsDiv.classList.add("vt323-regular", "options");
    this.currentEffect = effect;
    this.optionsDiv.appendChild(this.yesButton);
    this.noButton = document.createElement("button");
    this.noButton.innerHTML = "No";
    this.yesButton.addEventListener("mouseover", () =>
      this.play(this.buttonAudioName, true)
    );
    this.yesButton.addEventListener("click", () =>
      this.manageEffect(effect, true)
    );
    this.noButton.addEventListener("mouseover", () =>
      this.play(this.buttonAudioName, true)
    );
    this.noButton.addEventListener("click", () =>
      this.manageEffect(effect, false)
    );

    this.optionsDiv.appendChild(this.noButton);
  }

  manageEffect(effect, bool) {
    this.trigger("clicked", [effect, bool]);
  }
  removeText() {
    this.container.classList.add("z-order");
    this.textDiv.innerHTML = "";
    this.optionsDiv.innerHTML = "";
    this.yesButton.removeEventListener("click", () =>
      this.manageEffect(this.currentEffect, false)
    );
    this.noButton.removeEventListener("click", () =>
      this.manageEffect(this.currentEffect, true)
    );
    this.noButton.removeEventListener("mouseover", () =>
      this.play(this.buttonAudioName, true)
    );
    this.yesButton.removeEventListener("mouseover", () =>
      this.play(this.buttonAudioName, true)
    );

    this.currentEffect = null;
    this.container.removeChild(this.textDiv);
    this.container.removeChild(this.optionsDiv);
    this.off("clicked");
  }

  getMessage(name) {
    return textSources[name];
  }

  displayMessage(name = "dummy") {
    if (!this.isDisplayingFullscreenMessage) {
      this.messageContainer = document.createElement("div");
      this.messageContainer.classList.add("container", "fullMessage", "caveat");
      this.messageContainer.classList.remove("z-order");
      this.messageDiv = document.createElement("div");
      this.messageContainer.appendChild(this.messageDiv);
      this.messageDiv.classList.add("invisible", "fullscreenMessage");
      this.currentMessagePart = 0;
      this.currentMessage = this.getMessage(name);
      this.totalMessageParts = this.currentMessage.parts.length - 1;

      this.isDisplayingFullscreenMessage = true;

      this.addPartsOfMessage();
      this.play(this.openAudioName);
      this.messageContainer.addEventListener("animationend", () => {
        this.messageDiv.classList.remove("invisible");
      });
      this.messageDiv.addEventListener("animationend", () => {
        this.startMessageChain();
      });
      this.body.appendChild(this.messageContainer);
    }
  }

  startMessageChain() {
    if (!this.chainStarted) {
      this.allowSounds();
      this.manageClickPass();
      this.chainStarted = true;
    }
  }
  manageClickPass() {
    if (this.messageContainer) {
      this.messageContainer.removeEventListener("click", () => {
        this.displayNextMessage();
      });
      this.messageContainer.addEventListener("click", () => {
        this.displayNextMessage();
      });
    }
  }
  addPartsOfMessage() {
    for (
      let i = 0;
      i < this.currentMessage.parts[this.currentMessagePart].length;
      i++
    ) {
      this.messageDiv.innerHTML += `<p>${
        this.currentMessage.parts[this.currentMessagePart][i]
      }</p>`;
    }
  }
  displayNextMessage() {
    // this just doesn't work and it calls itself 4 times for some reason i can't understand, adding a fence here just for that
    if (this.currentMessagePart + 1 > this.totalMessageParts)
      this.removeMessageScreen();
    else {
      this.play(this.readAudioName);
      this.currentMessagePart++;
      this.messageDiv.innerHTML = "";
      this.addPartsOfMessage();
    }
  }

  removeMessageScreen() {
    if (this.messageContainer.hasChildNodes())
      this.messageContainer.removeChild(this.messageDiv);
    this.messageContainer.removeEventListener("animationend", () =>
      this.messageDiv.classList.remove("invisible")
    );
    this.messageContainer.removeEventListener("click", () =>
      this.displayNextMessage()
    );
    this.messageContainer.classList.add("z-order");
    this.messageDiv.removeEventListener("animationend", () => {
      this.startMessageChain();
    });
    this.isDisplayingFullscreenMessage = false;
    this.chainStarted = false;
  }

  addAudio(audio, name, baseVolume = 1.0) {
    try {
      audio.volume = baseVolume;
      this.audio[name] = audio;
    } catch (e) {
      console.error(e);
    }
  }
  allowSounds() {
    this.canPlaySounds = true;
  }
  disableSound() {
    this.canPlaySounds = false;
  }
  play(name, allowStop = false) {
    try {
      if (!name) return;
      if (allowStop) {
        this.audio[name].pause();
        this.audio[name].currentTime = "0";
      }
      this.audio[name].play();
    } catch (e) {
      console.warn("no audio can be played");
      console.error(e);
    }
  }
}
