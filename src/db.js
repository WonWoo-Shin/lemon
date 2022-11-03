import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/lemon");

const db = mongoose.connection;

db.once("open", () => console.log("DB Connected✅"));
db.once("error", (error) => console.log("DB Connect failed❌ : ", error));
