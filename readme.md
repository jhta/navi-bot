# Navi Slackbot

Slackbot created with Botkit.ai NodeJS Framework and DatoCMS

### Start server:
`npm start`

### Requirements:
In order to run this server you need first to:
* Create the slack application: https://api.slack.com/
* Set slack permisions and event suscriptions.
* You will need domain. You can use ngrok to test it locally.
* Create a DatoCMS project (it's free!) get the API token.

### How it works?

<img src="/diagram.png" width="700" />


To complete the configuration of this bot, make sure to update the included `.env` file with your platform tokens and credentials. Check `.env.example` file.

[Botkit Docs](https://botkit.ai/docs/v4)

This bot is powered by [a folder full of modules](https://botkit.ai/docs/v4/core.html#organize-your-bot-code). 
Edit the samples, and add your own in the [features/](features/) folder.
