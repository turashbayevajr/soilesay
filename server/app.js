const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const registrationRouter = require("./router/registration");
const suraqJauapRouter = require("./router/suraqjauap");
const userProgressRouter = require("./router/userProgress");
const newsRouter = require("./router/news");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", registrationRouter);
app.use("/", suraqJauapRouter);
app.use("/", userProgressRouter);
app.use("/api/news", newsRouter);
app.use('/uploads', express.static('uploads'));


mongoose
    .connect("mongodb+srv://soilsesay:soilsay123@soilesay.qtvrxci.mongodb.net/SoileSay", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

app.listen(8000, () => {
    console.log("Port connected on 8000");
});
