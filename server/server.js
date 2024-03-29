const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://colinjzhu:oHyjq71VhzThf0Su@cluster0.eup5ybx.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const express = require('express');
const cors = require("cors")
const axios = require("axios");
const app = express();
const port = 9000; // Or any other desired port



app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  })
)


/*
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}*/



let solutions = async (token, type, start, end) =>
  Promise.all(
    (await puzzles(token, type, start, end))
      .filter((d) => d.solved)
      .map((puzzle) =>
        nyt(
          `svc/crosswords/v6/game/${puzzle.puzzle_id}.json`,
          token
        ).then((json) => ({ ...json, puzzle }))
      )
  )

let puzzles = async (token, type, start, end) =>
(
  nyt(
    `svc/crosswords/v3/puzzles.json?publish_type=${type}&date_start=${start}&date_end=${end}`,
    token
  ).then((json) => json.results)
)

let nyt = async (path, token) => {
  const key = String([path, token]);
  //query database first
  const axiosConfig = {
    headers: {
      "Cookie": `NYT-S=${token}`
    }
  };


  const json = await axios.get(`https://nytimes.com/${path}`, axiosConfig).then((res) => res.data);

  //const collection = client.db("crossword").collection("crossworddata");
  //await collection.insertOne(json); 
  return json;

}

let getData = async ([name, token], type, start, end) =>
  (await solutions(token, type, start, end)).map((solution) => ({
    ...solution,
    name
  }))


app.get('/', async (req, res) => {
  try {
    const { name, token, type, start, end } = req.query; // Getting parameters from query string

    if (!name || !token || !type || !start || !end) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const data = await getData([name, token], type, start, end);
    res.status(200);
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

//run().catch(console.dir);