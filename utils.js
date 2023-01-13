function buildEmojiPicker() {
  // Style:
  // display:grid
  //
  //
  const emojiDecimalRanges = [
    [128512, 128591],
    [9986, 10160],
    [128640, 128704],
  ];
  let outputString =
    "<div class='emojiPicker'><span class= 'material-icons exit-emoji '>cancel</span>";
  emojiDecimalRanges.forEach((arr) => {
    for (let i = arr[0]; i < arr.at(-1); i++) {
      outputString += `<p class='emoji'>&#${i};</p>`;
    }
  });
  outputString += "</div>";
  return outputString;
}

function setEmojiListeners(inputBox) {
  const emojiWrapper = document.querySelector(".emojiPicker");
  const body = document.querySelector("body");
  body.addEventListener("click", removeEmojiPickerOnBodyClick);
  emojiWrapper.addEventListener("click", (e) => {
    if (e.target.classList.contains("emoji")) {
      inputBox.value += e.target.innerText;
    }
  });
}

function removeEmojiPickerOnBodyClick(ev) {
  const emojiWrapper = document.querySelector(".emojiPicker");
  const emojiClasses = ["pick-emoji", "emoji", "emojiPicker", "emojiWrapper"];

  for (const cls of ev.target.classList) {
    if (emojiClasses.includes(cls)) {
      return;
    }
  }
  emojiWrapper.style.animation = "fadeOut 0.3s ease-in-out";
  setTimeout(() => {
    emojiWrapper.remove();
  }, 300);
  removeEmojiListeners();
}

function removeEmojiListeners() {
  const body = document.querySelector("body");
  body.removeEventListener("click", removeEmojiPickerOnBodyClick);
}

export { buildEmojiPicker, setEmojiListeners, removeEmojiListeners };
