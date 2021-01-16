import path from 'path';
import fs from 'fs';
import Discord from 'discord.js';
import dotenv from 'dotenv';
import { Command } from './interfaces/Command';
import { RunOptions } from './interfaces/RunOptions';
import error from './error';

const bot = new Discord.Client();

async function readCommands(folder: string): Promise<{ [key: string]: Command | undefined }> {
  const files = fs.readdirSync(folder);
  const commands = files.map(async (fileName) => {
    const module = await import(path.join(folder, fileName));
    const mod = module?.default;
    if (mod === undefined || mod?.slug === undefined || mod.handler === undefined) {
      console.error(`Invalid command setup, check if your default export has both slug and handler defined ${fileName}`);
      process.exit(1);
    }
    const command: Command = {
      slug: mod?.slug,
      description: mod?.description,
      handler: mod?.handler,
    };
    return command;
  });
  return (await Promise.all(commands))
    .reduce((acc, v) => {
      acc[v.slug] = v;
      return acc;
    }, ({} as { [key: string]: any }));
}

async function run(options?: RunOptions): Promise<void> {
  dotenv.config();
  // ? Setup Options
  const commandsFolder = path.resolve(options?.commandsFolder || path.join('src', 'commands'));
  const prefix = options?.prefix ?? '!';

  // ? Initialize bot
  const commands = await readCommands(commandsFolder);

  bot.on('message', (msg) => {
    if (!msg.content.startsWith(prefix)) return;
    const tokens = msg.content.slice(1).split(' ');
    const slug = tokens.shift();
    const command = commands[slug ?? ''];
    if (command !== undefined) {
      command.handler(msg, tokens);
    } else {
      error(msg, prefix, slug, tokens);
    }
  });

  bot.login(process.env.BOT_TOKEN);
}

export default {
  run,
};
