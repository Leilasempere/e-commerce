import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import limiter from "./utils/limiter.js";


const app = express();


app.use(express.json());
app.use(cookieParser()); 
app.use(cors());

app.use(limiter);


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


app.use((req, res) => {
    res.status(404).json({ message: "Route non trouvée." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API démarrée sur http://localhost:${PORT}`);
});

export default app;