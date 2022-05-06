class PaletteGenerator {
  constructor() {
    this.DOMItems = {
      colors: document.querySelectorAll(".color"),
      colorIndicators: document.querySelectorAll(".colorIndicator"),
      adjustPanel: document.querySelector(".adjustment-panel"),
      colorContainer: document.querySelector(".colors"),
      applyButton: document.querySelector(".apply"),
      cancelButton: document.querySelector(".cancel"),
      libraryBtn: document.querySelector(".library__btn"),
      generateBtn: document.querySelector(".generate__btn"),
      saveBtn: document.querySelector(".save__btn"),
      savedPalettes: [],
    };
    this.renderApp();
  }

  lockColorGeneration = () => {
    const lockButtons = document.querySelectorAll(".controls__lock");

    lockButtons.forEach((button) =>
      button.addEventListener("click", (e) => {
        const iconClass = e.target.firstElementChild.className;

        e.target.parentNode.parentNode.classList.toggle("locked");

        iconClass === "fas fa-unlock"
          ? (e.target.firstElementChild.className = "fas fa-lock")
          : (e.target.firstElementChild.className = "fas fa-unlock");
      })
    );
  };

  setColorScheme = () => {
    const generateButton = document.querySelector(".generate__btn");
    let i = 0;

    for (const item of this.DOMItems.colors) {
      if (!item.className.includes("locked")) {
        let colorCode = chroma.random().hex();

        item.style.backgroundColor = colorCode;
        item.firstElementChild.innerText = colorCode;

        this.DOMItems.colorIndicators[i].style.backgroundColor = colorCode;
        i++;

        this.setTextContrast(colorCode, item);
      }
    }

    generateButton.addEventListener("click", () => {
      this.setColorScheme();
    });
  };

  colorAdjustmentHidding = () => {
    const buttons = [
      document.querySelector(".item__adjust"),
      document.querySelector(".cancel"),
    ];

    buttons[0].addEventListener("click", () => {
      this.resetSliderValues();
    });

    buttons.forEach((button) =>
      button.addEventListener("click", () => {
        this.DOMItems.adjustPanel.classList.toggle("hidden");
        this.DOMItems.colorContainer.classList.toggle(
          "adjustment-panel--active"
        );
      })
    );
  };

  setHue = () => {
    const hue = document.querySelector(".sliders__hue-input");

    hue.addEventListener("input", () => {
      for (let i = 0; i < this.DOMItems.colors.length; i++) {
        this.DOMItems.colorIndicators[i].style.backgroundColor = chroma(
          this.DOMItems.colors[i].style.backgroundColor
        ).set("hsl.h", Number.parseInt(hue.value));
      }
    });

    this.DOMItems.applyButton.addEventListener("click", () => {
      this.updateColorValues();
      for (let i = 0; i < this.DOMItems.colors.length; i++) {
        this.DOMItems.colors[i].style.backgroundColor =
          this.DOMItems.colorIndicators[i].style.backgroundColor;
      }
      this.DOMItems.adjustPanel.classList.toggle("hidden");
      this.DOMItems.colorContainer.classList.toggle("adjustment-panel--active");
      this.resetSliderValues();
    });

    this.DOMItems.cancelButton.addEventListener("click", () => {
      for (let i = 0; i < this.DOMItems.colors.length; i++) {
        this.DOMItems.colorIndicators[i].style.backgroundColor =
          this.DOMItems.colors[i].style.backgroundColor;
      }
      this.resetSliderValues();
    });
  };

  setBrightness = () => {
    const brightness = document.querySelector(".sliders__bright-input");

    brightness.addEventListener("input", () => {
      for (let i = 0; i < this.DOMItems.colors.length; i++) {
        this.DOMItems.colorIndicators[i].style.backgroundColor = chroma(
          this.DOMItems.colors[i].style.backgroundColor
        ).set("hsl.l", Number.parseFloat(brightness.value));
      }
      this.updateColorValues();
    });

    this.DOMItems.applyButton.addEventListener("click", () => {
      this.updateColorValues();
      for (let i = 0; i < this.DOMItems.colors.length; i++) {
        this.DOMItems.colors[i].style.backgroundColor =
          this.DOMItems.colorIndicators[i].style.backgroundColor;
      }
      this.DOMItems.adjustPanel.classList.toggle("hidden");
      this.DOMItems.colorContainer.classList.toggle("adjustment-panel--active");
      this.resetSliderValues();
    });

    this.DOMItems.cancelButton.addEventListener("click", () => {
      for (let i = 0; i < this.DOMItems.colors.length; i++) {
        this.DOMItems.colorIndicators[i].style.backgroundColor =
          this.DOMItems.colors[i].style.backgroundColor;
      }
      this.resetSliderValues();
    });
  };

  setSaturation = () => {
    const saturation = document.querySelector(".sliders__saturation-input");

    saturation.addEventListener("input", () => {
      for (let i = 0; i < this.DOMItems.colors.length; i++) {
        this.DOMItems.colorIndicators[i].style.backgroundColor = chroma(
          this.DOMItems.colors[i].style.backgroundColor
        ).set("hsl.s", Number.parseInt(saturation.value));
      }
    });

    this.DOMItems.applyButton.addEventListener("click", () => {
      this.updateColorValues();
      for (let i = 0; i < this.DOMItems.colors.length; i++) {
        this.DOMItems.colors[i].style.backgroundColor =
          this.DOMItems.colorIndicators[i].style.backgroundColor;
      }
      this.DOMItems.adjustPanel.classList.toggle("hidden");
      this.DOMItems.colorContainer.classList.toggle("adjustment-panel--active");
      this.resetSliderValues();
    });

    this.DOMItems.cancelButton.addEventListener("click", () => {
      for (let i = 0; i < this.DOMItems.colors.length; i++) {
        this.DOMItems.colorIndicators[i].style.backgroundColor =
          this.DOMItems.colors[i].style.backgroundColor;
      }
      this.resetSliderValues();
    });
  };

  copyToClipboard = () => {
    const colorValues = document.querySelectorAll(".color__hex");

    colorValues.forEach((colorValue) =>
      colorValue.addEventListener("click", () => {
        const popUp = document.querySelector(".copy");
        const text = document.createElement("textarea");
        //copying
        text.value = colorValue.innerText;
        document.body.appendChild(text);
        text.select();
        document.execCommand("copy");
        document.body.removeChild(text);
        // animation
        popUp.classList.add("active");
        setTimeout(() => {
          popUp.classList.remove("active");
        }, 2000);
      })
    );
  };

  savePalette = () => {
    const popUp = document.querySelector(".save");
    const popUpWindow = document.querySelector(".library__popup");
    const submit = document.querySelector(".save__submit");
    const cancel = document.querySelector(".save__cancel");
    popUp.classList.add("active");

    const inputField = document.querySelector(".save__name");

    let palette = {
      name: "",
      colors: [],
    };

    this.DOMItems.colors.forEach((color) => {
      palette.colors.push(chroma(color.style.backgroundColor).hex());
    });

    inputField.addEventListener("input", () => {
      palette.name = inputField.value;
    });

    submit.addEventListener("click", () => {
      if (localStorage.getItem("savedPalettes") !== null) {
        this.DOMItems.savedPalettes = JSON.parse(
          localStorage.getItem("savedPalettes")
        );
      }

      this.DOMItems.savedPalettes.push(palette);
      localStorage.setItem(
        "savedPalettes",
        JSON.stringify(this.DOMItems.savedPalettes)
      );

      inputField.value = "";

      const popupPalette = document.createElement("div");
      popupPalette.className = "popup_palette";

      const controlls = document.createElement("div");
      controlls.className = "controlls";

      let colors = document.createElement("div");
      colors.className = "popup__colors";

      let header = document.createElement("h3");
      header.innerText = palette.name;
      header.style.margin = "0.3rem";

      let selectBtn = document.createElement("button");
      selectBtn.className = "selectBtn";
      selectBtn.innerHTML = '<i class="fa fa-check"></i>';

      controlls.appendChild(header);
      controlls.appendChild(selectBtn);

      popupPalette.appendChild(controlls);

      palette.colors.forEach((color) => {
        let colorBlock = document.createElement("div");
        colorBlock.style.width = "30px";
        colorBlock.style.height = "30px";
        colorBlock.style.margin = "0.5rem";
        colorBlock.style.backgroundColor = color;
        colors.appendChild(colorBlock);
      });

      popupPalette.appendChild(colors);
      popUpWindow.appendChild(popupPalette);

      const ctaHeading = document.querySelector(".cta");

      if (document.querySelector(".popup_palette")) {
        ctaHeading.innerText = "Pick your pallete";
      } else {
        ctaHeading.innerText = "You don't have saved palettes";
      }

      popUp.classList.remove("active");
    });

    cancel.addEventListener("click", () => {
      popUp.classList.remove("active");
    });
  };

  renderLibrary = () => {
    const popUpWindow = document.querySelector(".library__popup");

    if (
      localStorage.getItem("savedPalettes") &&
      !document.querySelector(".popup__palette")
    ) {
      const palettes = JSON.parse(localStorage.getItem("savedPalettes"));

      for (const palette of palettes) {
        const popupPalette = document.createElement("div");
        popupPalette.className = "popup_palette";

        const controlls = document.createElement("div");
        controlls.className = "controlls";

        let colors = document.createElement("div");
        colors.className = "popup__colors";

        let header = document.createElement("h3");
        header.innerText = palette.name;
        header.style.margin = "0.3rem";

        let selectBtn = document.createElement("button");
        selectBtn.className = "selectBtn";
        selectBtn.innerHTML = '<i class="fa fa-check"></i>';

        controlls.appendChild(header);
        controlls.appendChild(selectBtn);

        popupPalette.appendChild(controlls);

        palette.colors.forEach((color) => {
          let colorBlock = document.createElement("div");
          colorBlock.style.width = "30px";
          colorBlock.style.height = "30px";
          colorBlock.style.margin = "0.5rem";
          colorBlock.style.backgroundColor = color;
          colors.appendChild(colorBlock);
        });

        popupPalette.appendChild(colors);
        popUpWindow.appendChild(popupPalette);
      }
    }

    const ctaHeading = document.querySelector(".cta");

    if (document.querySelector(".popup_palette")) {
      ctaHeading.innerText = "Pick your pallete";
    } else {
      ctaHeading.innerText = "You don't have saved palettes";
    }

    const applyBtns = document.querySelectorAll(".selectBtn");

    applyBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const palettes = JSON.parse(localStorage.getItem("savedPalettes"));

        palettes.forEach((palette) => {
          if (
            palette.name === e.target.parentNode.firstElementChild.innerText
          ) {
            this.updateColorScheme(palette.colors);
          }
        });
      });
    });
  };

  checkLibrary = () => {
    const popUp = document.querySelector(".library");
    const closeBtn = document.querySelector(".library__close");

    closeBtn.addEventListener("click", () => {
      popUp.classList.remove("active");
    });

    popUp.classList.add("active");
  };

  updateColorValues = () => {
    for (let i = 0; i < this.DOMItems.colorIndicators.length; i++) {
      this.setTextContrast(
        chroma(this.DOMItems.colorIndicators[i].style.backgroundColor).hex(),
        this.DOMItems.colors[i]
      );
      this.DOMItems.colors[i].firstElementChild.innerText = chroma(
        this.DOMItems.colorIndicators[i].style.backgroundColor
      ).hex();
    }
  };

  resetSliderValues = () => {
    const sliders = document.querySelectorAll("input[type=range]");
    sliders.forEach((slider) => (slider.value = 0));
  };

  setTextContrast = (color, text) => {
    if (chroma(color).luminance() > 0.5) {
      text.style.color = "black";
      return;
    }
    text.style.color = "white";
  };

  updateColorScheme = (colors) => {
    this.DOMItems.colors.forEach((item, index) => {
      item.style.backgroundColor = colors[index];
      item.firstElementChild.innerText = colors[index];
      this.setTextContrast(colors[index], item);
    });

    this.DOMItems.colorIndicators.forEach((item, index) => {
      item.style.backgroundColor = colors[index];
    });
  };

  renderApp = () => {
    this.lockColorGeneration();
    this.setColorScheme();
    this.colorAdjustmentHidding();
    this.setHue();
    this.setBrightness();
    this.setSaturation();
    this.copyToClipboard();
    this.DOMItems.saveBtn.addEventListener("click", this.savePalette);
    this.DOMItems.libraryBtn.addEventListener("click", this.checkLibrary);
    this.renderLibrary();
  };
}

window.addEventListener("load", () => new PaletteGenerator());
