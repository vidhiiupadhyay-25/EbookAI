require("dotenv").config();
const express = require("express")
const cors = require("cors");
const path = require("path")
const connectDB = require("./config/db")

const authRoutes = require('./routes/authRoutes')
const bookRoutes = require('./routes/bookRoutes')
const aiRoutes = require('./routes/aiRoutes')
const exportRoutes = require('./routes/exportRoutes')

const app = express();

// middlewarre to handle cors
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

//connect database
connectDB();

//middleware
app.use(express.json());

//static folder for uploads
app.use("/backend/uploads", express.static(path.join(__dirname, "uploads")))

//routes here
app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/export', exportRoutes)


//start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

