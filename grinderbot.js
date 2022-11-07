const mineflayer = require('mineflayer')
const Vec3 = require('vec3')
const { RaycastIterator } = require('prismarine-world').iterators
const { Webhook } = require('discord-webhook-node');
const hook = new Webhook("https://discord.com/api/webhooks/972639923809177670/eFasdbCy_KJ9Do9NEnxWQa-8FnYcMsJy4yTyReDjNqvonx2q5c8LhrnxnznVLCoPxCKY");
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
const debugmode=process.argv[5];
if (debugmode) {
  console.log("----------------------------------------------------------------------------------------------------------------------");
  console.log(`Debug Mode Enabled - ${mcUsername}:${mcPassword}`);
  console.log("----------------------------------------------------------------------------------------------------------------------");
}

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

let t=0

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
  if (debugmode) {
    console.log(`${bot.username} || ${message}`);
  }
  if (message.includes(`${targetign} has invited you to join their party`)) {
    bot.chat(`/p accept ${targetign}`);
  }
  if (message.includes("Latest update:")) {
    /*
    let scoreboardd=bot.scoreboard;
    scoreboardd=scoreboardd[1]["itemsMap"];
    for (const [key, value] of Object.entries(scoreboardd)) {
      //console.log(value["displayName"]);
      display=value["displayName"]
      //console.log(display.text)
      if (display.text=="Level: "){
        bbbb=display.extra[0];
        console.log(bbbb.extra)
      }
      for (const [key, value] of Object.entries(display)) {
        if (value=='Level: '){
        //console.log(key);
        //console.log("The key^")
        }
      }
    }
    */
    await sleep(7000);
    if (found) {
      //console.log(`${bot.username} has found ${targetign}!`)
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
  if (message.startsWith("KILL!")&&(message.includes("XP")&&(message.includes("g")))){
    timer1=0;

    if (!debugmode){
      let x=message.split("+")
      let xp=x[1]
      let gold1=x[2]
      let gold2=gold1.split("g")
      let gold=gold2[0]
      gold=gold+"g"
      console.log(`${xp}and ${gold} gained by ${bot.username}`);
  }
  }
  if (message.startsWith("ASSIST!")) {
    timer1=0;
    if (!debugmode){
      let x=message.split("+")
      let xp=x[1]
      let gold1=x[2]
      let gold2=gold1.split("g")
      let gold=gold2[0]
      gold=gold+"g"
      console.log(`${xp}and ${gold} gained by ${bot.username}`);
    }
  }
  if (message.includes("MAJOR EVENT! SPIRE")&&message.includes("in 1 min")) {
    start=false;
    bot.chat("/oof");
  }
  if (message.startsWith("You are AFK. Move around to return from AFK.") || message.startsWith("A kick occured in your connection")||message.startsWith("disconnect.spam")||message.startsWith("You were spawned in Limbo.")||message.startsWith("/limbo for more information.")||message.startsWith("Oops")||message.startsWith("OOPS")) {
    console.log("Bot in limbo for some reason, doing /lobby.")
    bot.chat("/lobby");
    await sleep(500);
  }
})

bot.once('spawn', async () => {
  bot.chat("/lobby");
  await sleep(3000);
  while (true) {
      playerlist=bot.players;
      //console.log(bot.scoreboards);
      if ("Pit" in bot.scoreboards) {
        if (debugmode) {console.log(`${bot.username} in pit.`)}
        found=true;
        await sleep(6000);
      } else {
        start=false;
        found=false;
        if (bot.getControlState('forward') == true) bot.setControlState('forward', false);
        if (bot.getControlState('jump') == true) bot.setControlState('jump', false);
        console.log(`${bot.username} switching lobbies.`);
        bot.chat("/play pit");
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
  timer++;
  if (start&&toggl) {
  timer1++;
  }
  timer2++;
  if (timer1>=1000) {
    console.log(`${bot.username} has gained no kills or assists in 50s, switching lobbies.`);
    bot.chat("/play pit");
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


bot.on('kicked', console.log);
bot.on('end', async (reason) => {
  username=bot.username;
  console.log(reason);
  if (reason.includes("banned")) {
    console.log(`${username} has been banned.`)
  } else {
    const bot = mineflayer.createBot({ client: client, hideErrors: true });
  }
/*  if(!logged) return
  await wait(30000) // 300000 = 5mins
  start()*/
})
bot.on('error', console.log)