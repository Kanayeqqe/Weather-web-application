require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.static(__dirname));

const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT || 3000;

app.get("/weather", async (req, res) => {
  try {
    const city = req.query.city;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ru&appid=${API_KEY}`;

    const response = await axios.get(url);
    res.json(response.data);

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "weather failed" });
  }
});

app.get("/forecast", async (req, res) => {
  try {
    const city = req.query.city;

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=ru&appid=${API_KEY}`;

    const response = await axios.get(url);
    res.json(response.data);

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "forecast failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});










