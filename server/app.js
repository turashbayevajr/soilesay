const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const registrationRouter = require("./router/registration");
const suraqJauapRouter = require("./router/suraqjauap");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", registrationRouter);
app.use("/", suraqJauapRouter);

mongoose
    .connect("mongodb+srv://soilsesay:soilsay123@soilesay.qtvrxci.mongodb.net/SoileSay")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

app.listen(8000, () => {
    console.log("Port connected on 8000");
});
