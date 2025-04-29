import express from "express"
import connectToDB from "./connectToDB";
import { protect } from "./middleware/authMiddleware";
import authRoutes from "./routes/auth";
import cors from "cors";

const app=express();
const PORT=4000;

app.use(cors());
app.use(express.json());

connectToDB();

app.get('/', (req, res) =>{
    res.status(200).send("working")
})

// Routes
app.use('/api/auth', authRoutes);

// Example of a protected route
app.get('/api/protected', protect, (req, res) => {
  res.json({ message: 'This is a protected route', user: (req as any).user });
});

app.listen(PORT, async () =>{
    console.log('Server running');

});