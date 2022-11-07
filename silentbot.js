const mineflayer = require('mineflayer')
const Vec3 = require('vec3')
const { RaycastIterator } = require('prismarine-world').iterators
const { Webhook } = require('discord-webhook-node');
const hook = new Webhook("https://discord.com/api/webhooks/1006728448779243561/ZZqm7-eDZgcim2ugfuaw9K1lbn46kn1qIrx5LhC4Xclv7m4v-rVoHySh2YFIz8c5QhAA");
const mc = require('minecraft-protocol')
const socks = require('socks').SocksClient

proxy=process.argv[4];
proxysplit=proxy.split(":");
login=process.argv[3];
loginsplit=login.split(":")
//bot.lookAt(new Vec3(0,0,0))
start = false
targetign=process.argv[2]
lastSent=0
lastSwap=Date.now()
found=false
const mcUsername=loginsplit[0];
const mcPassword=loginsplit[1];
const mcServerHost="mc.hypixel.net";
const mcServerPort="25565";
const proxyHost=proxysplit[0];
const proxyPassword=proxysplit[3];
const proxyPort=proxysplit[1];
const proxyUsername=proxysplit[2];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const client = mc.createClient({
  connect: client => {
      socks.createConnection({
          proxy: {
              host: proxyHost,
              port: parseInt(proxyPort),
              type: 5,
              userId: proxyUsername,
              password: proxyPassword
          },
          command: 'connect',
          destination: {
              host: mcServerHost,
              port: parseInt(mcServerPort)
          }
      }, (err, info) => {
          if (err) {
              console.log(err)
              return
          }

          client.setSocket(info.socket)
          client.emit('connect')
      })
  },

  host: mcServerHost,
  port: parseInt(mcServerPort),
  username: mcUsername,
  password: mcPassword,
  auth: 'microsoft',
  version: '1.8.9',
})

const bot = mineflayer.createBot({ client: client, hideErrors: true });


const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}


toggl=true;

bot.entityAtCursor = (maxDistance = 3.5) => {
  const block = bot.blockAtCursor(maxDistance)
  maxDistance = block?.intersect.distanceTo(bot.entity.position) ?? maxDistance

  const entities = Object.values(bot.entities)
    .filter(entity => entity.type !== 'object' && entity.username !== bot.username && entity.position.distanceTo(bot.entity.position) <= maxDistance)

  const dir = new Vec3(-Math.sin(bot.entity.yaw) * Math.cos(bot.entity.pitch), Math.sin(bot.entity.pitch), -Math.cos(bot.entity.yaw) * Math.cos(bot.entity.pitch))
  const iterator = new RaycastIterator(bot.entity.position.offset(0, bot.entity.height, 0), dir.normalize(), maxDistance)

  let targetEntity = null
  let targetDist = maxDistance

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i]
    const w = entity.width / 2

    const shapes = [[-w, 0, -w, w, entity.height + (entity.type === 'player' ? 0.18 : 0), w]]
    const intersect = iterator.intersect(shapes, entity.position)
    if (intersect) {
      const entityDir = entity.position.minus(bot.entity.position) // Can be combined into 1 line
      const sign = Math.sign(entityDir.dot(dir))
      if (sign !== -1) {
        const dist = bot.entity.position.distanceTo(intersect.pos)
        if (dist < targetDist) {
          targetEntity = entity
          targetDist = dist
        }
      }
    }
  }

  return targetEntity
}

bot.leftClick = () => { // Basic left clicking
  bot.swingArm('left')
  let entity = bot.entityAtCursor()
  if (entity) {
    bot.attack(entity, false)
  }
}
var killtime=0;
var timer1=0;
bot.on('messagestr', async (message) => {
  if (message.includes(`${targetign} has invited you to join their party`)) {
    bot.chat(`/p accept ${targetign}`)
  }
  if (message.includes("Latest update:")) {
    await sleep(7000);
    if (found) {
      console.log(`${bot.username} has found ${targetign}!`)
      spawny = (bot.entity.position.y-20)
      start = true
    }
  }
  if (message.includes("MAJOR EVENT!")&&message.includes("starting now")) {
    start=false;
    bot.chat("/oof");
  }
  if (message.includes("PIT EVENT ENDED:")) {
    start=true;
  }
  if (message.includes("KILL! on")&&(message.includes("XP")&&(message.includes("g")))){
    timer1=0;
  }
  if (message.includes("MAJOR EVENT! SPIRE")&&message.includes("in 1 min")) {
    start=false;
    bot.chat("/oof");
  }
  if (message.includes("You are AFK. Move around to return from AFK.")) {
    bot.chat("/lobby");
    sleep(500);
  }
  if (message.includes(`${targetign}:`)&&((message.includes("kymp is daddy")) || message.includes("how are you") || message.includes("i like shrek"))) {
    if (toggl) {
      toggl=false;
      if (bot.getControlState('forward') == true) bot.setControlState('forward', false);
      if (bot.getControlState('jump') == true) bot.setControlState('jump', false);
      bot.chat("/oof");
    } else if (!toggl) {
      toggl=true;
    } 
  }
})

bot.once('spawn', async () => {
  while (true) {
      playerlist=bot.players
      if (targetign in playerlist) {
        found=true
        await sleep(6000);
      } else {
        start=false;
        found=false;
        if (bot.getControlState('forward') == true) bot.setControlState('forward', false);
        if (bot.getControlState('jump') == true) bot.setControlState('jump', false);
        bot.chat("/play pit");
        console.log(`${bot.username} switching lobbies.`)
        await sleep(6000);
      }
  }
})

var timer=0
var timer2=0
var randomx=0.5
var randomy=0.5
var jumptimer=0
bot.on('physicTick', () => {
  timer++
  timer1++
  timer2++
  if (timer1>=400) {
    bot.chat("/oof");
    timer1=0;
    sleep(50);
  }
  if (start&&toggl) {
    jumptimer++
    if (bot.entity.position.y < spawny) {
      if (bot.getControlState('jump')&&(jumptimer==20)) {
        bot.setControlState('jump', false);
      }
      if ((bot.getControlState('jump')==false)&&(jumptimer>=40)) {
        bot.setControlState('jump', true);
        jumptimer=0
      }    
      if (bot.getControlState('sprint')) bot.setControlState('sprint', false);
      if (timer>=5) {
      try {
      if (bot.nearestEntity(({ type }) => type === 'player')) {
        var { username } = bot.nearestEntity(({ type }) => type === 'player')
        coords = bot.players[username].entity.position
        x = coords.x
        y = coords.y
        z = coords.z
        x =x
        y += 1.5
        z =z
        bot.lookAt(new Vec3(x, y, z))
        if (timer>=5) {
          timer=0
          bot.leftClick()
        }
      }}
      catch(err) {
        e=0
      }}
    } else if (bot.entity.position.y >= spawny) {
      jumptimer=0;
      if (timer2 >=60) {
        timer2=0;
        randomx=getRandomInt(-4,4)
        randomy=getRandomInt(-4,4)
      }
      bot.lookAt(new Vec3(randomx, spawny + 1, randomy))
      if (bot.getControlState('forward') == false) bot.setControlState('forward', true);
      if (bot.getControlState('sprint') == false) bot.setControlState('sprint', true);
      if (bot.getControlState('jump') == false) bot.setControlState('jump', true);
    }
  }
  if (!start) {
    if (bot.getControlState('forward') == true) bot.setControlState('forward', false);
    if (bot.getControlState('sprint') == true) bot.setControlState('sprint', false);
    if (bot.getControlState('jump') == true) bot.setControlState('jump', false);
  }
})


bot.on('kicked', console.log)
bot.on('error', console.log)