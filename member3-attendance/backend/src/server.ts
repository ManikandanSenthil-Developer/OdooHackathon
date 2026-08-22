import express from "express";
import cors from "cors";
import attendanceRoutes from "./routes/attendanceRoutes";

const app = express();

// CORS (allow React frontend)
app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
  })
);

app.use(express.json());

// Attendance APIs
app.use("/api/attendance", attendanceRoutes);

const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`Attendance API listening on port ${port}`);
});

export default app;