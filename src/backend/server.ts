import express from "express"
import connectToDB from "./connectToDB";
import { protect } from "./middleware/authMiddleware";
import authRoutes from "./routes/auth";
import bookRoutes from "./routes/bookRoutes"
import userRoutes from "./routes/userRoutes"
import recommendationRoutes from "./routes/recommendationsRoutes";
import cartRoutes from "./routes/cartRoutes";
import cors from "cors";
import cookieParser from "cookie-parser"
import path from "path";

const app=express();
const PORT=4000;

const corsOptions = {
  origin: 'http://localhost:3000', // Frontend origin (React)
  credentials: true, // Allow credentials (cookies)
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(cookieParser());

connectToDB();

app.get('/', (req, res) =>{
    res.status(200).send("working")
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/browse', bookRoutes);
app.use('/api/user', userRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/buy', cartRoutes)

// Example of a protected route
app.get('/api/protected', protect, (req, res) => {
  res.json({ message: 'This is a protected route', user: (req as any).user });
});

app.listen(PORT, async () =>{
    console.log('Server running');

});

/*app.use(express.static(path.join(__dirname, '../public')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
});*/

export default app;