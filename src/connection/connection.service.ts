import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import * as net from 'net';

// @Injectable()
// export class ConnectionService {
//   constructor() {}

//   public subject = new Subject<any>();
//   public socket: net.Socket;
//   public saveBuffer;
//   public dataLength;

//   public setConnection() {
//     this.socket = net.connect({ port: 8000, host: 'localhost' });

//     this.socket.on('connect', () => {
//       console.log('connected');
//       this.socket.write('Hello from client');
//     });

//     this.socket.on('data', (chunk: any) => {
//       try {
//         console.log('----------------------------');
//         console.log('chunk original: ', chunk);
//         console.log('chunk length: ', chunk.length);
//         console.log('Number(chunk.slice(0, 4) -> ', Number(chunk.slice(0, 4)));
//         // chunk안에서 스캔시작점 index 초기값 0
//         let index = 0;
//         // 패킷검사
//         // 사이즈패킷인지
//         if (chunk.length === 4) {
//           index = 0;
//           this.dataLength = Number(chunk);
//           this.saveBuffer = null;
//           return;
//         }
//         // chunk 복사
//         let data = Buffer.from(chunk);
//         if (this.saveBuffer && this.saveBuffer.length > 0) {
//           console.log('this.saveBuffer -> ', this.saveBuffer.toString());
//           data = Buffer.concat([this.saveBuffer, Buffer.from(chunk)]);
//           console.log('totalData -> ', data.toString());
//         }
//         // 사이즈패킷이 아니면
//         // else {
//         console.log('index: ', index);
//         console.log('data.length -> ', data.length);
//         while (index < data.length) {
//           // 사이즈가 패킷맨 앞에 있는지
//           console.log('index ', index);
//           const sizeSliced = data.slice(index, index + 4);
//           const length = Number(sizeSliced);
//           console.log('length ', length);
//           // 첫번째 데이터 스캔이 아니고 사이즈가 잘려있을경우
//           if (index !== 0 && sizeSliced.length < 4) {
//             // 사이즈 저장 후 이번 data 처리종료
//             console.log('for save ', index, ' ', index + 4);
//             console.log('sizeSliced ', sizeSliced);
//             console.log('sizeSliced.len ', sizeSliced.length);
//             this.saveBuffer = Buffer.from(sizeSliced);
//             // data.copy(saveBuffer, 0, index, index + 4);
//             console.log('saveBuffer ', this.saveBuffer.toString());
//             break;
//           }
//           // 사이즈 형변환
//           const nLength = Number(length);
//           // nLength를 형변환 후 NaN이면 jsonString, 숫자면 사이즈
//           if (Number.isNaN(nLength)) {
//             // jsonString이므로 직전 패킷에서 dataLength에 저장한 만큼 읽기
//             const jsonStr = data.slice(index, this.dataLength);
//             console.log('data packet ', jsonStr.toString());
//             try {
//               const parsed = JSON.parse(jsonStr.toString());
//               this.saveBuffer = null;
//               this.subject.next(parsed);
//             } catch (e) {
//               // json parsing 에러면 불완전한 데이터이므로 사이즈와 함께 버퍼에 저장 후 종료
//               console.error(e);
//               console.log('uncomplete json string');
//               // saveBuffer = Buffer.from('');
//               this.saveBuffer = Buffer.from(sizeSliced.toString() + jsonStr);
//               console.log('saveBuffer ', this.saveBuffer.toString());
//               break;
//             }
//             index += this.dataLength;
//           } else {
//             // nLength가 숫자이므로 사이즈를 dataLength에 저장 후 그만큼 읽기
//             this.dataLength = nLength;
//             console.log(
//               'index + 4 ',
//               index + 4,
//               'index + dataLength + 4 ',
//               index + this.dataLength + 4,
//             );
//             const jsonStr = data.slice(index + 4, index + this.dataLength + 4);
//             console.log('packet ', jsonStr.toString());
//             try {
//               const parsed = JSON.parse(jsonStr.toString());
//               this.saveBuffer = null;
//               this.subject.next(parsed);
//             } catch (e) {
//               // json parsing 에러면 불완전한 데이터이므로 사이즈와 함께 버퍼에 저장 후 종료
//               console.error(e);
//               console.log('uncomplete json string');
//               this.saveBuffer = Buffer.from(sizeSliced.toString() + jsonStr);
//               console.log('saveBuffer ', this.saveBuffer.toString());
//               break;
//             }
//             index += this.dataLength + 4;
//           }
//         }
//       } catch (error: any) {
//         console.log(error);
//       }
//     });
//   }
//   public getSubject() {
//     return this.subject;
//   }
// }

@Injectable()
export class ConnectionService {
  constructor() {}

  public subject = new Subject<any>();
  public socket: net.Socket;
  public buffer = '';

  public setConnection() {
    this.socket = net.connect({ port: 8000, host: 'localhost' });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.socket.write('Hello from client');
    });

    this.socket.on('data', (chunk: Buffer) => {
      this.buffer += chunk.toString(); // Append new data to buffer
      console.log('Received raw chunk:', chunk.toString()); //
      this.handleMessage(chunk.toString());
    });
  }

  private handleMessage(message: string) {
    try {
      //const data = JSON.parse(message);
      //console.log(message);
      this.subject.next(message);
    } catch (error) {
      console.error('Failed to parse message:', message, error);
    }
  }

  public getSubject() {
    return this.subject;
  }
}
