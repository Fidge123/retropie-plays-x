import { WriteStream } from 'fs';
import { Client } from 'irc';
import { create, key_event, setup } from 'uinput';
import * as yargs from 'yargs';
import { allowedInputs, getCommandRegex, getCreateOptions, getSetupOptions, toKey } from './commands';

let stream: WriteStream;

const argv = yargs
  .usage('Usage: $0 [-s server] [-c channel] [-p port] [-d delay]')
  .alias('s', 'server')
  .default('s', 'tolkien.freenode.net')
  .alias('c', 'channel')
  .default('c', '#zBzLAN27')
  .alias('p', 'port')
  .default('p', 6667)
  .alias('d', 'delay')
  .default('d', 100).argv;

const client = new Client(argv.server as string, 'zBzBOT', {
  channels: [argv.channel as string],
  port: argv.port as number,
  autoConnect: false,
  autoRejoin: true
});

client.addListener(`message${argv.channel}`, (sender: string, message: string): void => {
  if (getCommandRegex().test(message)) {
    console.log(`${sender}: ${message}`);

    setTimeout(() => {
      key_event(stream, toKey(message as allowedInputs), (error?: Error) => {
        if (error instanceof Error) {
          throw error;
        }
      });
    }, argv.delay);
  }
});

client.addListener('error', (error?: Error): void => {
  console.log('error:', error);
});

client.connect(5, () => {
  console.log('Connection successful!');
  setTimeout(() => {
    client.say(argv.channel as string, 'BEEP BOOP, I am a bot!');
  }, 5000);
});
console.log('Connecting...');

setup(getSetupOptions(), (err0: Error | undefined, tempStream: WriteStream): void => {
  if (err0 instanceof Error) {
    throw err0;
  }

  stream = tempStream;

  create(stream, getCreateOptions(), (err1?: Error) => {
    if (err1 instanceof Error) {
      throw err1;
    }
  });
});
