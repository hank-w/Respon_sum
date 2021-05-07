import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { QUESTION_PROTOCOL, QUESTION_WEBSOCKET_URL } from '../api';
import { Question } from '../../types/api';

export type CloseFunction = () => void;

export const streamQuestions = ({
  url,
  onReceive,
  onClose,
  onError,
}: {
  url: string,
  onReceive: (q: Question) => void,
  onClose?: () => void,
  onError?: () => void,
}): CloseFunction => {
  const client = new W3CWebSocket(url, QUESTION_PROTOCOL);
  client.onmessage = e => {
    if (typeof e.data === 'string') {
      onReceive(JSON.parse(e.data) as Question);
    }
  };
  if (onClose != null) {
     client.onclose = () => onClose();
  }
  if (onError != null) {
    client.onerror = () => onError();
  }
  return () => client.close(1000);
};
