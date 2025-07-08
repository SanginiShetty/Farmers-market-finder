import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ampcRouter = express.Router();

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ampcRouter.get("/", (req, res) => {
    const filePath = path.resolve(__dirname, "../routers/AMPC.json");
    console.log("filePath", filePath);
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            res.status(500).json({ error: "Failed to read data",err });
            return;
        }
        const AMPCs = JSON.parse(data).APMCs;
        const location = req.query.location;
        console.log("location", location);

        if (location) {
            const filteredAMPCs = AMPCs.filter((ampc) =>
                ampc.MarketList.some((market) =>
                    market.MainMarketNameE.toLowerCase().includes(
                        location.toLowerCase()
                    ) || market.MainMarketNameM.includes(location)
                )
            );
            res.status(200).json(filteredAMPCs);
        } else {
            res.status(200).json(AMPCs);
        }
    });
});

export { ampcRouter };
