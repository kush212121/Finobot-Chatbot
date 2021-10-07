import React, { useState, useEffect } from "react";

import "./App.css";
import LscgLogo from "./assets/LscgLogo.png";

// Firebase SDK

// Firebase hooks
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "./firebase";

import SignIn from "./components/Auth/SignIn";
import ChatRoom from "./components/ChatRoom/ChatRoom";

//api
import { createCustomer, getCustomer } from "./api/createCustomer";

function App() {
  // const [user] = useAuthState(auth);

  const [togglerClass, setTogglerClass] = useState("toggle-finnobot-active");
  const [isFinOpen, setIsFinOpen] = useState(true);
  const [botClass, setBotClass] = useState("finnobot-active");

  const [user, setUser] = useState(null);

  const handleToggle = () => {
    // isFinOpen ? setTogglerClass("") : setTogglerClass("toggle-finnobot-active");
    setIsFinOpen(!isFinOpen);

    if (isFinOpen) {
      setTogglerClass("");
      setBotClass("");
    } else {
      setBotClass("finnobot-active");
      setTogglerClass("toggle-finnobot-active");
    }
  };

  useEffect(() => {
    let finnCustomerId = localStorage.getItem("finnCustomerId");

    (async () => {
      try {
        let res;
        if (finnCustomerId) res = await getCustomer(finnCustomerId);
        else res = await createCustomer();

        console.log({ res });
        setUser(res.data);
        localStorage.setItem("finnCustomerId", res.data._id);
      } catch (error) {
        console.log({ error });
      }
    })();
  }, []);

  return (
    <div>
      <div className={`finnobot ${botClass}`}>
        <ChatRoom handleToggle={handleToggle} />
      </div>
      <button
        className={`toggle-finnobot ${togglerClass}`}
        onClick={handleToggle}
      >
        <img src={LscgLogo} alt="lscg-logo" />
      </button>
    </div>
  );
}

export default App;
