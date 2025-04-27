import Experience from "../Experience";
import EventEmitter from "./EventEmitter";

/**
 * Not my proudest code, things don't get reused, this is not really good usage of
 * a class, will need to be refactor for later usage!
 * At least it should be split between -> options menu and message menu (could extend from something)
 */
export default class TextUtil extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.container = document.createElement("div");
    this.messageContainer = document.createElement("div");
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
    this.yesButton.addEventListener("click", () =>
      this.manageEffect(effect, true)
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
    this.currentEffect = null;
    this.container.removeChild(this.textDiv);
    this.container.removeChild(this.optionsDiv);
    this.off("clicked");
  }

  getMessage(name) {
    if (name == "bottleMessage" || name == "dummy") {
      return {
        type: "poem",
        parts: [
          [
            "I met a traveller from an antique land",
            "Who said: Two vast and trunkless legs of stone",
            "Stand in the desert. Near them, on the sand,",
            "Half sunk, a shattered visage lies, whose frown,",
          ],
          [
            "And wrinkled lip, and sneer of cold command,",
            "Tell that its sculptor well those passions read",
            "Which yet survive, stamped on these lifeless things,",
            "The hand that mocked them and the heart that fed.",
            "And on the pedestal these words appear:",
          ],
          [
            `"My name is Ozymandias, king of kings:`,
            `Look on my works, ye Mighty, and despair!"`,
            "",
            "Nothing beside remains. Round the decay",
            "Of that colossal wreck, boundless and bare",
            "The lone and level sands stretch far away",
          ],
        ],
      };
    }
  }

  displayMessage(name = "dummy") {
    if (!this.isDisplayingFullscreenMessage) {
      this.messageContainer.classList.add(
        "container",
        "fullMessage",
        "gloria-hallelujah-regular"
      );
      this.messageContainer.classList.remove("z-order");
      this.messageDiv = document.createElement("div");
      this.messageContainer.appendChild(this.messageDiv);
      this.messageDiv.classList.add("invisible");
      this.currentMessagePart = 0;
      this.currentMessage = this.getMessage(name);
      this.totalMessageParts = this.currentMessage.parts.length;

      this.isDisplayingFullscreenMessage = true;

      for (
        let i = 0;
        i < this.currentMessage.parts[this.currentMessagePart].length;
        i++
      ) {
        this.messageDiv.innerHTML += `<p>${
          this.currentMessage.parts[this.currentMessagePart][i]
        }</p>`;
      }
      this.messageContainer.addEventListener("animationend", () =>
        this.messageDiv.classList.remove("invisible")
      );
      this.messageDiv.addEventListener("animationend", () => {
        this.messageContainer.addEventListener("click", () => {
          this.displayNextMessage();
        });
      });

      this.body.appendChild(this.messageContainer);
    }
  }

  displayNextMessage() {
    this.removeMessageScreen();
  }

  removeMessageScreen() {
    if (this.messageContainer.hasChildNodes())
      this.messageContainer.removeChild(this.messageDiv);
    this.messageDiv.removeEventListener("animationend", () => {
      this.messageContainer.addEventListener("click", () => {
        this.displayNextMessage();
      });
    });
    this.messageContainer.removeEventListener("animationend", () =>
      this.messageDiv.classList.remove("invisible")
    );
    this.messageContainer.removeEventListener("click", () => {
      this.displayNextMessage();
    });
    this.messageContainer.classList.add("z-order");

    this.isDisplayingFullscreenMessage = false;
  }
}
