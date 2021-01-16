import { Message } from 'discord.js';

export interface Command {
  slug: string;
  description?: string;
  handler: (msg: Message, args?: string[]) => void;
}
