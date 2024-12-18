require("dotenv").config();
const express = require("express");
const adminRouter = require("./routes/adminRouter");
const userRouter = require("./routes/userRouter");
const courseRouter = require("./routes/courseRouter");
const studentRouter = require("./routes/studentRouter");
const ratingRouter = require("./routes/ratingRouter");
const app = express();
const PORT = process.env.PORT || 5000;
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const Redis = require("ioredis");
const RedisStore = require("connect-redis");
const cors = require("cors");
const {
  checkForAuthentication,
} = require("./middlewares/checkForAuthentication");

//Class...
const redisClient = new Redis({
  host: "localhost", // or the Redis host you use
  port: 6379, // default Redis port
  // Optionally, you can add authentication and other configurations here
});

//Middlewares...
app.use(
  cors({
    origin: "https://mern-frontend-self-eight.vercel.app/",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());
app.use(
  session({
    store: new RedisStore({ client: redisClient }), // Pass the Redis client
    secret: process.env.FLASH_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

//Routes...
app.get("/", checkForAuthentication("token"), (req, res) => {
  res.send("home");
});

app.get("/auth/check", checkForAuthentication("token"), (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    console.log("user", user);
    if (!user) {
      return res.status(401).json({ msg: "Login first" });
    }
    res.status(200).json({
      message: "Authenticated",
      user: {
        id: user?.id,
        fullname: user?.fullname,
        username: user?.username,
        email: user?.email,
        role: user?.role,
      },
    });
  } catch (error) {
    return res.status(401).json({ message: `${error}` });
  }
});
app.use("/", (req, res) => {
  res.send("server runnign...");
});
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/courses", courseRouter);
app.use("/enrollment", studentRouter);
app.use("/rating", ratingRouter);

app.listen(PORT, () => console.log(`Server Started at PORT NO: ${PORT}`));
