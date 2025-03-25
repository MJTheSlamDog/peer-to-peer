import express from "express";

import authRoutes from "./routes/auth.route.js";

const app = express();

const port = 5001;

app.use("/api/auth", authRoutes);

app.listen(5001, () => {
    console.log(`Server is running on port ${port}`);
});
