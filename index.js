import express from "express";
import path from "path";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'static')));

// Basic route example
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'static', 'index.html'));
});

// Custom 404 handling
app.use((req, res) => {
    res.status(404).sendFile(path.join(process.cwd(), 'static', '404.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
