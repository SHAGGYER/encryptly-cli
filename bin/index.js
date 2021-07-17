#! /usr/bin/env node
const yargs = require("yargs");
const {generateApp} = require("encryptly-auth-sdk")
const chalk = require('chalk');
const boxen = require('boxen');
const {isValidHttpUrl} = require("../utils/index")

const usage = "\nUsage: encryptly-cli generate:app <commands> Generates a new app";
const options = yargs
    .usage(usage)
    .command("generate:app")
    .option("s", {alias:"server-url", describe: "URL of your auth server", type: "string", demandOption: true})
    .option("n", {alias:"name", describe: "Name of the app", type: "string", demandOption: true })
    .option("r", {alias:"redirect-url", describe: "Redirect URL", type: "string", demandOption: true})
    .option("u", {alias:"url", describe: "URL of your app", type: "string", demandOption: true})
    .help(true)
    .argv;

if (options._[0] !== "generate:app") {
    console.log("You need to run the 'generate:app' command");
    process.exit(0);
}

const {serverUrl, redirectUrl, name, url} = options

let errorCount = 0;

if (!isValidHttpUrl(serverUrl)) {
    errorCount++;
    console.log("Server URL must start with http(s)");
}

if (!isValidHttpUrl(url)) {
    errorCount++;
    console.log("App URL must start with http(s)");
}

if (!isValidHttpUrl(redirectUrl)) {
    errorCount++;
    console.log("Redirect URL must start with http(s)");
}

if (errorCount) {
    process.exit(0);
}

generateApp({serverUrl, redirectUrl, name, url})
    .then(response => {
        if (response.errors) {
            for (let error of response.errors) {
                console.log(error);
            }

            process.exit(0);
        }

        console.log(
            boxen(chalk.green(
                "You have successfully generated your new app!",
                "\n" +
                "Client Id: " +
                response.app.clientId +
                "\n" +
                "Client Secret: " +
                response.app.clientSecret +
                "\n" +
                "Auth Server URL: " +
                serverUrl
            ), {
                padding: 1,
                borderColor: "green",
                dimBorder: true
            }),
        )
    })
