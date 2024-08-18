import { ChemicalServer } from "chemicaljs";
import express from "express";
import path from "path";

const chemical = new ChemicalServer();
const port = process.env.PORT || 3000;

// Serve static files from the 'dist' directory
chemical.use(express.static(path.join(__dirname, "dist"), {
    index: "index.html",
    extensions: ["html"]
}));

chemical.error((req, res) => {
    res.status(404);
    res.send("404 Error");
});

chemical.listen(port, () => {
    console.log(`Chemical example listening on port ${port}`);
});
