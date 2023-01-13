import Slider from "./slider.js";
import ChatRoom from "./chat.js";

const mainLoader = document.querySelector(".main-loader");
const blurWrapper = document.querySelector(".blur-wrapper");
blurWrapper.style.display = "none";

const chatData = ChatRoom.fetchMessages()
  .then((data) => {
    mainLoader.style.display = "none";
    blurWrapper.style.display = "block";
    const slider = new Slider();

    ChatRoom.addChatListeners(data);

    return data;
  })
  .catch((err) => console.log(err));
