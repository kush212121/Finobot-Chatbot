import React, { useEffect, useRef, useState } from "react";

//SpeechRecognition

const ChatForm = ({ submitMessage }) => {
  const [isListening, setIsListening] = useState(false);
  const [formValue, setFormValue] = useState("");
  const [isEmojiTrayOpen, setIsEmojiTrayOpen] = useState(false);

  let isChrome = navigator.userAgent.indexOf("Chrome") > -1;

  const inputRef = useRef(null);

  let SpeechRecognition, mic;

  if (isChrome) {
    SpeechRecognition =
      window.SpeachRecognition || window.webkitSpeechRecognition;
    mic = new SpeechRecognition();
    mic.continuous = false;
    mic.interimResults = false;
    mic.lang = "en-US";
  }
  useEffect(() => {
    if (isChrome) isListening ? handleListen() : mic.stop();
  }, [isListening]);

  useEffect(() => {
    inputRef.current.scrollLeft = inputRef.current.scrollWidth;

    // if (isChrome) alert("Chrome it is");
    // else alert("isnt chrome");
  }, [formValue]);

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log("continue....");
        setIsListening(false);
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log("Stopped mic...");
      };
    }

    mic.onstart = () => {
      console.log("mics on..");
    };

    mic.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map((res) => res[0])
        .map((res) => res.transcript)
        .join("");

      console.log(transcript);
      setFormValue(transcript);
      submitMessage(transcript);
      setFormValue("");

      mic.onerror = (e) => {
        console.log(e.error);
      };
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEmojiTrayOpen(false);

    submitMessage(formValue);
    setFormValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="chatroom__form">
      {isEmojiTrayOpen && (
        <div className="chatroom__emogiTray">
          <span onClick={() => setFormValue((prev) => prev + "😂")}>😂</span>
          <span onClick={() => setFormValue((prev) => prev + "😍")}>😍</span>
          <span onClick={() => setFormValue((prev) => prev + "❌")}>❌</span>
          <span onClick={() => setFormValue((prev) => prev + "👍")}>👍</span>
          <span onClick={() => setFormValue((prev) => prev + "😎")}>😎</span>
          <span onClick={() => setFormValue((prev) => prev + "😢")}>😢</span>
          <span className="arrow-down"></span>
        </div>
      )}
      <input
        type="text"
        className="chatroom__input"
        value={formValue}
        onChange={(e) => setFormValue(e.target.value)}
        ref={inputRef}
        onFocus={() => setIsEmojiTrayOpen(false)}
      />

      <i
        className="fa fa-smile-o text-white"
        onClick={() => setIsEmojiTrayOpen((prev) => !prev)}
      ></i>

      {isChrome && (
        <i
          className={`fa fa-microphone ${isListening ? "mic-enabled" : ""}`}
          onClick={() => setIsListening(!isListening)}
        />
      )}

      <button type="submit" className="chatroom__button">
        Enter
      </button>
    </form>
  );
};

export default ChatForm;
