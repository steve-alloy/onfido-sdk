<script>
    import { init } from "onfido-sdk-ui";

    const getAppId = async () => {
        const credsResponse = await fetch("/creds", {
            "method": "POST"
        });

        const credsData = await credsResponse.json();
        const token = credsData.token;
        const appId = credsData.appId;

        const checkBody = {
            appId
        };

        init({
            token: token,
            containerId: "onfido-mount",
            onComplete: async (data) => {
                console.log("Onfido Data", data);
                const checkResponse = await fetch("/check", {
                    "method": "POST",
                    "body": JSON.stringify(checkBody),
                    "headers": {
                        "Content-Type": "application/json"
                    }
                });

                const checkData = await checkResponse.json();
                console.log("Check Data", checkData);
            },
            steps: ["document", "complete"],
        });
    };

    getAppId();
</script>