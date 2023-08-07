export { };
import express from "express";
const app = express();
import mongoose from "mongoose";
const port = 3000;
import authRoutes from "./routes/auth";
import todoRoutes from "./routes/todo";
import cors from "cors";

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);

mongoose.connect('mongodb://0.0.0.0:27017/mytodos', { dbName: "mytodos" })
    .then((err) => {
        if (err) console.log(err);
        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`)
        });
    });
