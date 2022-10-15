<script>
    import { init } from "onfido-sdk-ui";

    let firstName = "";
    let lastName = "";
    let checkId = "";

    const getAppId = async () => {

        const credsBody = {
            firstName,
            lastName
        }

        const credsResponse = await fetch("/creds", {
            "method": "POST",
            "body": JSON.stringify(credsBody),
            "headers": {
                "Content-Type": "application/json"
            }
        });

        const credsData = await credsResponse.json();
        const token = credsData.token;
        const appId = credsData.appId;

        const checkBody = {
            appId,
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
                checkId = checkData.data.id;
                console.log("Check Data", checkData);
            },
            steps: ["document", "complete"],
        });
    };

    getAppId();
</script>

<div>
    <h1>Onfido App</h1>
    <form>
        <input type="text" placeholder="First Name" bind:value={firstName}/>
        <input type="text" placeholder="Last Name" bind:value={lastName}/>
    </form>

    {#if checkId}
        <h3>Check ID: {checkId}</h3>
    {/if}
</div>

<style>
    input {
        display: block;
        margin-bottom: 5px;
    }
</style>