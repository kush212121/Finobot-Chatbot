import axios from "axios";

const fetchResponse = async (msg) => {
  const options = {
    method: "POST",
    url: "https://chatback.londonscg.co.uk/",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    },
    data: [msg],
  };

  try {
    // const res = await axios.post("https://chatback.londonscg.co.uk/", {});
    const res = await axios.request(options);
    return res.data;
  } catch (error) {
    console.log({ error });
    return error;
  }

  //   if (data.is_multi === "true") {
  //     setMultOptions(data.options);
  //     setIsMultiOpen(true);
  //   }
};

export default fetchResponse;
