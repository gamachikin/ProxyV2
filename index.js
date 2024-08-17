import { ChemicalServer } from "chemicaljs";
import express from "express";
import { execSync } from "node:child_process";
import fs from "node:fs";

if (!fs.existsSync("dist")) {
    console.log("No build folder found. Building...");
    execSync("pnpm run build");
    console.log("Built!");
}

const chemical = new ChemicalServer({
    scramjet: false,
    rammerhead: false,
});

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "dist" directory
app.use(
    express.static("dist", {
        index: "index.html",
        extensions: ["html"],
    })
);

// Handle 404 errors with a custom error page
app.use((req, res) => {
    res.status(404);
    res.sendFile("dist/index.html", { root: "." });
});

// Use the ChemicalServer middleware
app.use(chemical.middleware());

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
