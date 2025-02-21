// hello 
const express = require("express");
const { apiRouter } = require("./routes");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());



app.use("/api/v1", apiRouter);

app.listen(3000);