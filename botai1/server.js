require("dotenv/config");
const { Client, IntentsBitField } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

const bot = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

bot.on("ready", () => {
  console.log("aibot is ready!");
});

const config = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(config);

async function handleMessage0(message){console.log("msg:", message.content);}
async function handleMessage1(message){
  if (message.author.bot) return;
  if (message.channel.id != process.env.CHANNEL_ID) return;
  if (message.content.startsWith("!")) return;
  let conversationLog = [
    { role: "system", content: "you are an encouraging chatbot" },
  ];
  conversationLog.push({
    role: "user",
    content: message.content,
  });
  await message.channel.sendTyping();
  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: conversationLog,
  });
  message.reply(result.data.choices[0].message);
}
async function handleMessage(message){
  if (message.author.bot) return;
  if (message.channel.id != process.env.CHANNEL_ID) return;
  if (message.content.startsWith("!")) return;
  let conversationLog = [
    { role: "system", content: "you are an encouraging chatbot" },
  ];
  await message.channel.sendTyping();

  let prevMessages = await message.channel.messages.fetch({limit:15});
  prevMessages.reverse()
  prevMessages.forEach(msg=>{
    if (msg.content.startsWith("!")) return;
    if (msg.author.id !== bot.user.id || msg.author.bot) return;
    if (msg.author.id !== message.author.id) return;

    conversationLog.push({ role: "user", content: msg.content });
  })

  //conversationLog.push({ role: "user", content: message.content });
  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: conversationLog,
  });
  let res = result.data.choices;
  message.reply(`${res.length}:${res[0].message.content}`); //[0].message);
}

bot.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.id != process.env.CHANNEL_ID) return;
  if (message.content.startsWith("!")) return;
  await message.channel.sendTyping();
  let conversationLog = [
    { role: "system", content: "you are an encouraging chatbot" },
    { role: "user", content: message.content },
  ];
  let prevMessages = await message.channel.messages.fetch({ limit: 15 });
  prevMessages.reverse();
  prevMessages.forEach((msg) => {
    if (msg.content.startsWith("!")) return;
    if (msg.author.id !== bot.user.id && msg.author.bot) return;
    if (msg.author.id !== message.author.id) return;

    conversationLog.push({ role: "user", content: msg.content });
  });

  //conversationLog.push({ role: "user", content: message.content });
  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: conversationLog,
  });
  message.reply(result.data.choices[0].message);
  // let res = result.data.choices;
  // message.reply(`HALLO`); //[0].message);
});

bot.login(process.env.TOKEN);
