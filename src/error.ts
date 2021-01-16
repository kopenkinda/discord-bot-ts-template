import { Message } from 'discord.js';

export default function error(msg: Message, prefix: string, slug?: string, args?: string[]) {
  msg.reply(`Invalid command ${prefix}${slug} ${args?.join(' ')}`);
}
