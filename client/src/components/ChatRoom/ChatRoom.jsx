import React, { useRef, useState, useEffect } from "react";

//DESC: Assets
import ChromeLogo from "../../assets/ChromeLogo.svg";

//DESC: Custom Components
import MultiOption from "./MultiOption/MultiOption";

//DESC: sockets
import io from "socket.io-client";
import ChatForm from "./ChatForm/ChatForm";
import ChatMessage from "./ChatMessage";

let socket;

const ChatRoom = ({ handleToggle }) => {
  //DESC: refs
  const dummy = useRef(null);
  let isChrome = navigator.userAgent.indexOf("Chrome") > -1;

  //DESC: States
  const [isMultiOpen, setIsMultiOpen] = useState(false);
  const [multOptions, setMultOptions] = useState([]);
  const [connectedAgent, setConnectedAgent] = useState(null);
  const [messages, setMessages] = useState([]);

  const [availAgents, setAvailAgents] = useState([]);

  //New states
  const [agentSocId, setAgentSocId] = useState(null);

  //START: Socket init
  //DESC: Client Socket Connection
  const ENDPOINT = process.env.REACT_APP_ENDPOINT || "http://localhost:5000";

  console.log({ ENDPOINT });

  useEffect(() => {
    console.log("sockets enabled");
    socket = io(ENDPOINT);

    //DESC: vars
    // const userName = auth.currentUser.displayName || "Anonymous";
    const userName = "user";

    //DESC: Join Event
    socket.emit("join", { userName }, (error) => {
      console.log({ error });
    });

    //DESC: Disconnect Event
    return () => {
      socket.disconnect();
      socket.off();
    };

    // auth.signInAnonymously();
  }, [ENDPOINT]);
  //END: Socket init

  //START: functions
  const submitMessage = (text) => {
    // photoURL:
    //   "https://www.freepngimg.com/thumb/facebook/62681-flat-icons-face-computer-design-avatar-icon.png",

    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
      minute: "numeric",
    });

    console.log({ currentTime });

    const msg = {
      text,
      sender: "me",
      photoURL:
        "https://www.freepngimg.com/thumb/facebook/62681-flat-icons-face-computer-design-avatar-icon.png",
      timestamp: currentTime,
    };

    setMessages((prev) => [...prev, msg]);

    socket.emit(
      "message",
      {
        text,
        customerSocId: socket.id,
        agentSocId,
      },
      ({ text, err, tag, agentSocId: agSocId, options, agentName }) => {
        if (err) return console.log({ err });

        console.log({ tag });

        const currentTime = new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: true,
          minute: "numeric",
        });

        setMessages((prev) => [
          ...prev,
          {
            text,
            sender: "agent",
            photoURL:
              "https://www.freepngimg.com/thumb/facebook/62681-flat-icons-face-computer-design-avatar-icon.png",
            timestamp: currentTime,
          },
        ]);

        if (agentName) {
          setMessages((prev) => [
            ...prev,
            {
              text: `${agentName} has connected!`,
              sender: "bot",
              photoURL:
                "https://www.freepngimg.com/thumb/facebook/62681-flat-icons-face-computer-design-avatar-icon.png",
              timestamp: currentTime,
            },
          ]);
        }

        if (options) {
          console.log({ options });
          setMultOptions(options);
          setIsMultiOpen(true);
        }

        if (agSocId) setAgentSocId(agSocId);

        dummy.current.scrollIntoView();
      }
    );
    setIsMultiOpen(false);
  };
  //END: functions

  useEffect(() => {
    //DESC: Socket Events

    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
      minute: "numeric",
    });

    socket.on("agent-disconnect", ({ message }) => {
      const msg = {
        text: message,
        sender: "bot",
        photoURL:
          "https://www.freepngimg.com/thumb/facebook/62681-flat-icons-face-computer-design-avatar-icon.png",
        timestamp: currentTime,
      };

      setMessages((prev) => [...prev, msg]);

      setAgentSocId(null);
    });

    socket.on("assign-agent", ({ agent }) => {
      setConnectedAgent(agent);
    });

    socket.on("message", ({ text, sender, photoURL, options }) => {
      console.log({ messages });

      const currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
        minute: "numeric",
      });

      setMessages((messages) => [
        ...messages,
        {
          text,
          sender,
          photoURL:
            "https://www.freepngimg.com/thumb/facebook/62681-flat-icons-face-computer-design-avatar-icon.png",
          timestamp: currentTime,
        },
      ]);

      if (options) {
        console.log({ options });
        setMultOptions(options);
        setIsMultiOpen(true);
      }

      dummy.current.scrollIntoView();
    });

    socket.on("plan-over", ({ message }) => {
      console.log({ message });
      alert(message);
    });
    socket.on("disconnect", (reason) => {
      if (reason == "io server disconnect") alert("Plan Over");
    });
  }, [ENDPOINT]);

  useEffect(() => {
    if (connectedAgent) {
      const agent = availAgents.find((agent) => agent.id === connectedAgent.id);

      const currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
        minute: "numeric",
      });

      if (!agent) {
        setConnectedAgent(null);
        console.log({ availAgents, connectedAgent, agent });
        setMessages((messages) => [
          ...messages,
          {
            text: "Agent has left the chat!",
            sender: "bot",
            photoURL:
              "https://i.pinimg.com/originals/08/e7/ec/08e7ec0f84233b37ac26e920bc60ec57.gif",
            timestamp: currentTime,
          },
        ]);
        setConnectedAgent(null);
      }
    }
  }, [availAgents, connectedAgent]);

  useEffect(() => {
    dummy.current.scrollIntoView();
  }, [messages, multOptions]);

  return (
    <div className="chatroom">
      <h1>Finnobot</h1>
      {/* <div className="chatroom__agentinfo">
        <div></div>
        <div>
          {availAgents.filter((a) => a.isOnline)[0] ? (
            availAgents
              .filter((a) => a.isOnline)
              .map(
                ({ imgURL }, i) =>
                  i < 3 && (
                    <img
                      src={"https://www.w3schools.com/howto/img_avatar2.png"}
                      alt="avail-agent"
                      className="agent__avatar"
                      key={i}
                    />
                  )
              )
          ) : (
            <i className="fa fa-user-times" />
          )}
        </div>
      </div> */}
      {/* 
      <div className="finn__logout" onClick={() => auth.signOut()}>
        <i className="fa fa-sign-out" aria-hidden="true"></i>
      </div> */}

      <div className="chatroom__drop" onClick={handleToggle}>
        <i className="fa fa-chevron-down"></i>
      </div>
      <div>
        {/* <SignOut /> */}

        <main className="chatroom__main">
          {!messages[0] && (
            <div className="chatroom__welcome">
              <img
                src="https://i.pinimg.com/originals/08/e7/ec/08e7ec0f84233b37ac26e920bc60ec57.gif"
                alt="bot"
              />
              <div>
                Hii, I'm Finnobot I'm here to solve all your problems ...
              </div>
            </div>
          )}

          {messages.map(({ text, sender, photoURL, timestamp }, i) => (
            <ChatMessage
              key={i}
              text={text}
              sender={sender}
              photoURL={photoURL}
              timestamp={timestamp}
            />
          ))}
          {isMultiOpen && (
            <MultiOption
              submitMessage={submitMessage}
              multOptions={multOptions}
            />
          )}
          <span ref={dummy}></span>
          {!isChrome && (
            <p className="chrome-comp">
              <img src={ChromeLogo} alt="chrome" />
              Works best on chrome browser
            </p>
          )}
        </main>

        <ChatForm submitMessage={submitMessage} />
      </div>
    </div>
  );
};

export default ChatRoom;
