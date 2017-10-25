import { WriteStream } from 'fs';
import { Client } from 'irc';
import { argv } from 'optimist';
import * as node_uinput from 'uinput';
import {
  allowedInputs,
  getCommandRegex,
  getCreateOptions,
  getSetupOptions,
  toKey
  } from './commands';
import { IUinput } from './interfaces/uinput';

const uinput = node_uinput as IUinput;
let stream: WriteStream;

if (argv.h || argv.help) {
  console.log('output usage help'); // TODO
}

const config = {
  server: argv.s || 'tolkien.freenode.net',
  channel: argv.c || '#zBzLAN27',
  port: argv.p || 6667,
  delay: argv.d || 100
};

const client = new Client(config.server, 'zBzBOT', {
  channels: [config.channel],
  port: config.port,
  autoConnect: false,
  autoRejoin: true
});

client.addListener(`message${config.channel}`, (sender: string, message: string): void => {
  console.log('got msg');
  if (message.match(getCommandRegex())) {
    console.log(`${sender}: ${message}`);

    setTimeout(() => {
      uinput.key_event(stream, toKey(message as allowedInputs), (error: Error) => {
        console.log(`key event triggered: ${toKey(message as allowedInputs)}`);
        if (error) {
          throw error;
        }
      });
    }, config.delay);
  }
});

client.addListener('error', (message: string): void => {
  console.log(`error: ${message}`);
});

client.connect();
console.log('Connecting...');

uinput.setup(getSetupOptions(), (err0: Error, tempStream: any): void => {
  if (err0) {
    throw err0;
  }

  stream = tempStream;

  uinput.create(stream, getCreateOptions(uinput), (err1: Error) => {
    if (err1) {
      throw err1;
    }
  });
});
