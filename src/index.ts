import { Client, Events, GatewayIntentBits, Partials } from 'discord.js'
import dotenv from 'dotenv'
import clientReady from './handlers/clientReady'
import interactionCreate from './handlers/interactionCreate'
import { errorHandling } from './handlers/unhandledRejection'
import voiceStateUpdate from './handlers/voiceStateUpdate'
import guildCreate from './handlers/guildCreate'

dotenv.config()

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
})

client.once(Events.ClientReady, clientReady)
client.on(Events.InteractionCreate, interactionCreate)
client.on(Events.GuildCreate, guildCreate)
client.on(Events.VoiceStateUpdate, voiceStateUpdate)

process.on('unhandledRejection', errorHandling)

client.login(process.env.TOKEN)
