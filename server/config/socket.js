//START: socket logic

import fetchResponse from "../api/fetchResponse.js";

//desc: Agents Arr
let agents = [];

export default (io) => {
  io.on("connection", (socket) => {
    let name;
    //DESC: User Join
    socket.on("join", ({ userName }, cb) => {
      console.log(`${userName} has joined the chat!`);
      name = userName;
      cb(agents);
    });

    //DESC: Agent Join
    socket.on("agent-join", ({ agentName }) => {
      console.log(`${agentName} agent has joined the chat!`);
      agents.push({
        id: socket.id,
        agentName,
        isOnline: true,
      });
      console.log({ agents });
      socket.broadcast.emit("agents-update", { agents });
    });

    //DESC: Agent Online/Offline toggle
    socket.on("busy", () => {
      const agent = agents.filter((ag) => ag.id === socket.id)[0];

      if (agent)
        agents = [
          ...agents.filter((a) => a !== agent),
          { ...agent, isOnline: !agent.isOnline },
        ];

      socket.broadcast.emit("agents-update", { agents });

      console.log({ agents });
    });

    //DESC: Send Messsage
    const sendMessage = (socketid, text, sender, photoURL, options) => {
      if (options) {
        io.to(socketid).emit("message", {
          text,
          sender,
          photoURL,
          options,
        });
      } else
        io.to(socketid).emit("message", {
          text,
          sender,
          photoURL,
        });
    };

    //DESC: Agent Messages

    socket.on("agent-message", ({ text, photoURL, clientId }, cb) => {
      console.log({ agentid: socket.id, text });

      // io.to(socket.id).to(clientId).emit("message", {
      //   text,
      //   sender: "agent",
      //   photoURL,
      // });
      // sendMessage(socket.id, text, "agent", photoURL);

      sendMessage(clientId, text, "agent", photoURL);
      cb();
    });

    //DESC: Message Handler
    socket.on("send-message", ({ text, receiver, photoURL, agentId }) => {
      console.log({ text, receiver });

      sendMessage(socket.id, text, "me", photoURL);

      if (receiver === "bot") {
        // const res = await fetchResponse(text);
        // console.log({res});
        fetchResponse(text).then((res) => {
          console.log({ res });

          //DESC: Assign agent
          if (res.tag === "true") {
            const availAgent = agents.filter(
              (agent) => agent.isOnline && agent
            )[agents.length - 1];

            if (availAgent) {
              io.to(socket.id).emit("assign-agent", {
                agent: availAgent,
              });
              io.to(availAgent.id).emit("assign-agent", {
                clientId: socket.id,
              });
              sendMessage(
                socket.id,
                "Agent has joined the chat!",
                "bot",
                "https://i.pinimg.com/originals/08/e7/ec/08e7ec0f84233b37ac26e920bc60ec57.gif"
              );
            } else
              sendMessage(
                socket.id,
                "No agent available!",
                "bot",
                "https://i.pinimg.com/originals/08/e7/ec/08e7ec0f84233b37ac26e920bc60ec57.gif"
              );

            console.log({ availAgent });
          } else if (res.is_multi === "true") {
            sendMessage(
              socket.id,
              res.reply,
              "bot",
              "https://i.pinimg.com/originals/08/e7/ec/08e7ec0f84233b37ac26e920bc60ec57.gif",
              res.options
            );
          } else {
            sendMessage(
              socket.id,
              res.reply,
              "bot",
              "https://i.pinimg.com/originals/08/e7/ec/08e7ec0f84233b37ac26e920bc60ec57.gif"
            );
          }
        });
      } else {
        console.log({ agentId });
        sendMessage(agentId, text, "client", photoURL);
      }
    });

    //DESC: User disconnect
    socket.on("disconnect", () => {
      console.log(`${name} has disconnected`);
      const agent = agents.filter((ag) => ag.id === socket.id)[0];

      agents = agents.filter((a) => a !== agent);
      console.log({ agents });
      socket.broadcast.emit("agents-update", { agents });
    });
  });

  //END: socket logic
};
