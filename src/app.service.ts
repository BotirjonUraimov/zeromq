import { Injectable } from '@nestjs/common';
import { ConnectionService } from './connection/connection.service';
// import Queue from 'sync-queue';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Queue = require('sync-queue');

const q = new Queue();

@Injectable()
export class AppService {
  constructor(private connectionService: ConnectionService) {}
  test() {
    const subject = this.connectionService.getSubject();
    this.connectionService.setConnection();
    console.log('before RxJs');
    subject.subscribe((msg) => {
      q.place(() => {
        console.log(msg);
        setTimeout(() => {
          q.next();
        }, 10000);
      });
    });
    console.log('After RxJs');
  }
}
