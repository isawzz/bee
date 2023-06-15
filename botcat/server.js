const discord = require("discord.js")
//const fetch = require("node-fetch")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const bot = new discord.Client()
const sadWords = ['sad','depressed','anxious','stress']
const encouragements = [
  'hang in there!',
  'I look forward to see you soon!',
  'oh, I feel for you!'
]

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => {
      return res.json()
    })
    .then(data => {
      return data[0]["q"] + " -" + data[0]["a"]
    })
}

bot.on("ready", () => {
  console.log(`Logged in as ${bot.user.tag}!`)
})

bot.on("message", msg => {
  console.log(`content ${msg.content} author:${msg.author.bot}`)
  if (msg.content === "?") {
    //msg.reply("yes, still here!")
    getQuote().then(quote=>msg.channel.send(quote))
  }

  if (sadWords.some(x=>msg.content.includes(x))){
    const enc = encouragements[Math.floor(Math.random()*encouragements.length)]
    msg.reply(enc);
  }
})

var TOKEN1 = process.env.TOKEN1
bot.login(TOKEN1)





















