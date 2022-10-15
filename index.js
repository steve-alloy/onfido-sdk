import path from "node:path";
import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const port = process.env.PORT;
const app = express();
const publicPath = path.join(__dirname, "./build/public");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(publicPath));

app.get("/", (req, res) => {
    res.sendFile(path.resolve(publicPath, "index.html"));
});

app.post("/creds", async (req, res) => {
    try {
        const credsBody = {
            "first_name": req.body.firstName ? req.body.firstName : "Dale",
            "last_name": req.body.lastName ? req.body.lastName : "Cooper"
        };
    
        const credsResponse = await fetch("https://api.onfido.com/v3.4/applicants", {
            "method": "POST",
            "body": JSON.stringify(credsBody),
            "headers": {
                "Authorization": `Token token=${process.env.ONFIDO_API_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        const credsData = await credsResponse.json();

        const appId = credsData.id;

        const sdkBody = {
            "applicant_id": appId
        };

        const sdkResponse = await fetch("https://api.onfido.com/v3.4/sdk_token", {
            "method": "POST",
            "body": JSON.stringify(sdkBody),
            "headers": {
                "Authorization": `Token token=${process.env.ONFIDO_API_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        const sdkData = await sdkResponse.json();

        const token = sdkData.token;

        return res.json({
            "ok": true,
            token,
            appId
        });

    } catch (err) {
        console.log("ERROR");
        return res.json({
            "ok": false,
            "error": err
        });
    }
});

app.post("/check", async (req, res) => {
    console.log(req.body);
    const appId = req.body.appId;
    const checkBody = {
        "applicant_id": appId,
        "report_names": ["document"]
    };

    try {
        const checkResponse = await fetch("https://api.eu.onfido.com/v3.4/checks", {
            "method": "POST",
            "headers": {
                "Authorization": `Token token=${process.env.ONFIDO_API_TOKEN}`,
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(checkBody)
        });

        const checkData = await checkResponse.json();
        const checkId = checkData.id;

        console.log("Check ID", checkId);

        return res.json({
            "data": checkData
        });
    } catch (err) {
        console.log("ERROR");
        return res.json({
            "ok": false,
            "error": err
        });
    };
});

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});