import { ChemicalBuild } from "chemicaljs";

const build = new ChemicalBuild({
    path: "dist",
    default: "uv",
    uv: true,
    scramjet: false,
    rammerhead: false,
});

await build.write(true);

console.log("Built!")