import { ChemicalServer } from "chemicaljs";
import express from "express";
import { execSync } from "child_process";
import fs from "fs";

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

app.use(
    express.static("dist", {
        index: "index.html",
        extensions: ["html"],
    })
);

app.use((req, res) => {
    res.status(404);
    res.sendFile("dist/index.html", { root: "." });
});

app.use(chemical.middleware());

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
