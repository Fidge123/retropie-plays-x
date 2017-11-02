import { WriteStream } from 'fs';
import { Client } from 'irc';
import { create, key_event, setup } from 'uinput';
import * as yargs from 'yargs';
import { allowedInputs, getCommandRegex, getCreateOptions, getSetupOptions, toKey } from './commands';

let stream: WriteStream;

const argv = yargs
  .option('server', {
    alias: 's',
    default: 'irc.freenode.net',
    describe: 'IRC server URL',
    nargs: 1,
    type: 'string'
  })
  .option('channel', {
    alias: 'c',
    default: '#zBzLAN27',
    describe: 'IRC channel name, should start with #',
    nargs: 1,
    type: 'string'
  })
  .option('port', {
    alias: 'p',
    default: 6667,
    describe: 'IRC port',
    nargs: 1,
    type: 'number'
  })
  .option('delay', {
    alias: 'd',
    default: 200,
    describe: 'Delay between IRC and game input',
    nargs: 1,
    type: 'number'
  }).argv;

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
        stream.removeAllListeners('error');
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
