import { auth } from "../../firebase";
import React from "react"

const ChatMessage = ({ text, photoURL, sender, timestamp }) => {
  // const { text, photoURL } = message;
  const isMe = sender === "me";

  const messageClass = isMe ? "sent" : "received";

  const linkify = (text) => {
    const urlRegex =
      /[-a-zA-Z0-9@:%\+.#?&//=]{2,256}\.[a-z]{2,15}\b(\/[-a-zA-Z0-9@:%\+.#?&//=]*)?/gi;

    return urlRegex.test(text);
  };

  const windowOpen = (url, name, specs) => {
    if (!url.match(/^https?:\/\//i)) {
      url = "http://" + url;
    }
    return window.open(url, name, specs);
  };

  return (
    <div className={`message ${messageClass}`}>
      <img
        src={
          isMe
            ? photoURL
            : "https://i.pinimg.com/originals/08/e7/ec/08e7ec0f84233b37ac26e920bc60ec57.gif"
        }
        alt="user-img"
      />
      <div className="message__text">
        {linkify(text)
          ? text.split(" ").map((url, i) => (
              <span
                key={i}
                className="link text-primary"
                onClick={() => windowOpen(url, url)}
              >
                {` ${url} `}
              </span>
            ))
          : text}

        <div className="message__time">{timestamp}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
