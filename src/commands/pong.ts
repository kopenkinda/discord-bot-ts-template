import { Command } from '../interfaces/Command';

const command: Command = {
  slug: 'ping',
  handler: (msg) => msg.reply('pong'),
};

export default command;
