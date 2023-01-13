import {
  buildEmojiPicker,
  setEmojiListeners,
  removeEmojiListeners,
} from "./utils.js";

export default class ChatRoom {
  constructor(city, username, messages) {
    this.city = city;
    this.messages = messages;
    this.username = username === undefined ? "Anonymous" : username;
    this.initialLoad = true;
    const main = document.querySelector("main");
    //check if other chats are open & close them
    [...main.children].map((child) => {
      if (child.classList.contains("chat")) {
        child.style.animation = "fadeOut 0.5s ease-out";
        child.remove();
      }
    });
    let mainPreload = document.createElement("div");
    mainPreload.innerHTML = this.buildBaseHtml();
    document.querySelector("main").appendChild(mainPreload.firstChild);
    this.accountIcon = document.querySelector(".account-switch");
    this.accountIcon.addEventListener("click", () => {
      this.changeUsername();
    });
    // Section where messages apear
    this.messageSection = document.querySelector(".messages-section");

    //wraps entire message/texting box
    this.messageBox = document.querySelector(".message-box");
    //wraps input text area & emoji picker
    this.textingWrapper = document.querySelector(".texting-wrapper");
    this.inputMessage = document.querySelector(".message-input");
    this.emojiPicker = document.querySelector(".pick-emoji");

    //Display db messages on init
    this.renderMessages();

    //listeners

    this.inputMessage.addEventListener("keyup", (e) =>
      e.key === "Enter" && e.target.value.length ? this.addMessage(e) : ""
    );
    this.emojiPicker.addEventListener("click", () => {
      for (const el of this.textingWrapper.children) {
        if (el.classList.contains("emojiPicker")) {
          el.style.animation = "fadeOut 0.3s ease-in-out";
          setTimeout(() => el.remove(), 300);
          removeEmojiListeners();
          return;
        }
      }
      const emojiBoard = buildEmojiPicker();
      let tempDiv = document.createElement("div");
      tempDiv.innerHTML = emojiBoard;
      this.textingWrapper.appendChild(tempDiv.firstChild);
      setEmojiListeners(this.inputMessage);
    });

    //Db change listener
    db.collection("Chats")
      .doc(this.city)
      .onSnapshot((snapshot) => {
        if (this.initialLoad) {
          this.initialLoad = false;
          return;
        }
        this._renderMessage(snapshot.data()["messages"].at(-1));
      });
  }

  static async fetchMessages() {
    let output = {};
    await db
      .collection("Chats")
      .get()
      .then((resp) =>
        resp.docs.forEach((doc) => {
          const data = doc.data();
          output[doc.id] = data.messages;
        })
      )
      .catch((err) => console.log(err));
    return output;
  }

  static addChatListeners(data) {
    document.querySelectorAll(".option").forEach((div) => {
      div.addEventListener("click", (e) => {
        e.preventDefault();
        const cityChat = new ChatRoom(
          e.target.id,
          "Anonymous",
          data[e.target.id]
        );
      });
    });
  }

  async fetchCountryMessages() {
    let output = {};
    await db
      .collection("Chats")
      .get()
      .then((resp) => {
        let matchingCity = resp.docs.filter((doc) => doc.id === this.city);
        matchingCity.forEach((doc) => {
          const data = doc.data();
          output[doc.id] = data.messages;
        });
      })
      .catch((err) => console.log(err));
    return output;
  }

  buildBaseHtml() {
    return `<div class='chat'><span class='country-span'>${this.city} chatroom</span><div class='messages-section'></div><div class='message-box'><div class='self-login'><span class='chat-username'>${this.username}</span><i class='material-icons account-switch'>switch_account</i></div><div class='texting-wrapper'><input class = 'message-input' type='text'></input><i class='material-icons pick-emoji'>sentiment_satisfied_alt</i></div></div></div>`;
  }

  _addZeros(integer) {
    return integer < 10 ? "0" + integer : "" + integer;
  }

  addMessage(e) {
    const moment = new Date();
    const message = e.target.value;
    e.target.value = "";
    const firebaseExportObject = {
      content: message,
      timestamp: firebase.firestore.Timestamp.fromDate(moment),
      username: this.username,
    };

    db.collection("Chats")
      .doc(this.city)
      .update(
        "messages",
        firebase.firestore.FieldValue.arrayUnion(firebaseExportObject)
      );
    // firebaseExportObject["timestamp"] = this._firebaseDateToChatFmt(
    //   firebaseExportObject.timestamp
    // );
    this.messages.push(firebaseExportObject);
  }

  _firebaseDateToChatFmt(firebaseDate) {
    const jsDate = firebaseDate.toDate();
    const day = this._addZeros(jsDate.getDate());
    let month = this._addZeros(jsDate.getMonth() + 1);
    if (month === 13) {
      month = 1;
    }
    const year = this._addZeros(jsDate.getFullYear().toString().slice(2));
    const hour = this._addZeros(jsDate.getHours());
    const minute = this._addZeros(jsDate.getMinutes());
    const time = `${day}/${month}/${year} ${hour}:${minute}`;
    return time;
  }

  _messageToHtml(obj) {
    return `<div class="message"><div class="message-header"><span class="message-username">${
      obj.username
    }</span><span class="message-time">@${this._firebaseDateToChatFmt(
      obj.timestamp
    )}</span></div><div class="message-content"><span class="content">${
      obj.content
    }</span></div></div>`;
  }
  _renderMessage(data) {
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML += this._messageToHtml(data);
    this.messageSection.appendChild(tempDiv.firstChild);
  }

  renderMessages() {
    this.messages.map((m) => {
      let tempDiv = document.createElement("div");
      tempDiv.innerHTML += this._messageToHtml(m);
      this.messageSection.appendChild(tempDiv.firstChild);
    });
  }

  changeUsername() {
    const body = document.querySelector("body");
    const blurSection = document.querySelector(".blur-wrapper");
    blurSection.style.opacity = 0.3;
    blurSection.style.filter = "blur(0.2rem)";
    let popupHtml =
      "<div class='popup-wrapper'><div class='account-popup'><p class='new-username-text'>Change username</p><form class='new-username-input'><input class='input-username' type='text' default='New username'></input><input class='submit-username' type='submit' value='Submit'></input></div></div>";
    let popupTemp = document.createElement("div");
    popupTemp.innerHTML += popupHtml;
    const popup = popupTemp.firstChild;
    body.appendChild(popup);
    function endPopup() {
      body.removeChild(popup);
      blurSection.style.opacity = 1;
      blurSection.style.filter = "blur(0)";
    }
    document.querySelector(".popup-wrapper").addEventListener("click", (e) => {
      if (e.target.className === "popup-wrapper") {
        return endPopup();
      }
    });
    const form = document.querySelector(".new-username-input");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const usernameInput = document.querySelector(".input-username");
      const inputVal = usernameInput.value;
      if (!inputVal.trim().length) {
        usernameInput.style.border = "0.1rem solid salmon";
        return;
      }
      endPopup();
      this.username = usernameInput.value;
      document.querySelector(".chat-username").innerText = this.username;

      return;
    });
  }
}
