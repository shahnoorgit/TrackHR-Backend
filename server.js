import dotenv from "dotenv";
import express from "express";
import connectDB from "./DB/DBconnect.js";
import UserRoute from "./Routes/User.routes.js";
import bodyParser from "body-parser";
import ContactRoute from "./Routes/Contact.route.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cors());

app.listen(8080, () => {
  connectDB();
  console.log("Server is running on port 8080");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/user", UserRoute);
app.use("/api/user/contacts", ContactRoute);
