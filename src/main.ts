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

const client = new Client(argv.server, 'zBzBOT', {
  channels: [argv.channel],
  port: argv.port,
  autoConnect: false,
  autoRejoin: true
});

client.addListener(`message${argv.channel}`, (sender: string, message: string): void => {
  if (getCommandRegex().test(message)) {
    console.log(`${sender}: ${message}`);

    setTimeout(() => {
      key_event(stream, toKey(message as allowedInputs), (error: Error | undefined) => {
        if (error) {
          throw error;
        }
      });
    }, argv.delay);
  }
});

client.addListener('error', (message: Error | undefined): void => {
  console.log('error:', message);
});

client.connect(5, () => {
  console.log('Connection successful!');
  setTimeout(() => {
    client.say(argv.channel, 'BEEP BOOP, I am a bot!');
  }, 5000);
});
console.log('Connecting...');

setup(getSetupOptions(), (err0: Error | undefined, tempStream: any): void => {
  if (err0) {
    throw err0;
  }

  stream = tempStream;

  create(stream, getCreateOptions(), (err1: Error | undefined) => {
    if (err1) {
      throw err1;
    }
  });
});
