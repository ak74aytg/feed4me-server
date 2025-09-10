const axios = require("axios");
require("dotenv").config();

const feedNews = async (req, res) => {
    console.log(process.env.NEWS_API_KEY)
  try {
    const response = await axios.get("https://newsdata.io/api/1/latest", {
      params: {
        apikey: process.env.NEWS_API_KEY, // ✅ correct param name
        q: "agriculture"
      }
    });


    console.log(response.data)
  } catch (error) {
    console.error("Error fetching news:", error.message);
  }
};

feedNews()