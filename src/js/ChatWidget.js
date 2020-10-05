import moment from 'moment';
import API from './API';

moment.locale('ru');

export default class ChatWidget {
  constructor(name) {
    this.userName = name;
    this.url = 'wss://ahj-sse-ws-backend-2.herokuapp.com/ws';
    this.api = new API('https://ahj-sse-ws-backend-2.herokuapp.com/users');
  }

  init() {
    this.chat = document.querySelector('.chat');
    this.chat.classList.remove('none');
    this.chatInput = this.chat.querySelector('.chat_input');
    this.chatWindow = document.querySelector('.chat_field');
    this.ws = new WebSocket(this.url);
    this.ws.addEventListener('message', (event) => {
      this.createMessage(event);
    });

    this.ws.addEventListener('error', () => {
      throw new Error('Ошибка в работе чата');
    });
    this.drawUsers();

    window.addEventListener('beforeunload', () => {
      this.api.remove(this.userName);
    });

    this.chatInput.addEventListener('keypress', (evt) => {
      if (evt.key === 'Enter') {
        this.sendMessage(this.chatInput.value);
        this.chatInput.value = '';
      }
    });
  }

  createMessage(message) {
    const { type } = JSON.parse(message.data);

    if (type === 'message') {
      const {
        name,
        msg,
        date,
      } = JSON.parse(message.data);
      const messageItem = document.createElement('div');
      messageItem.classList.add('message_item');
      let userName = name;
      if (name === this.userName) {
        userName = 'You';
        messageItem.classList.add('active_user');
      }
      const messageDate = moment(date).format('HH:mm:ss MM.DD.YYYY');
      messageItem.innerHTML = `
      <div class="message_header">
        <span>${userName}</span>
        <span>${messageDate}</span>
      </div>
      <div class="message_text">
      ${msg}
      </div>
      `;

      this.chatWindow.appendChild(messageItem);
      this.chatWindow.scrollTo(0, messageItem.offsetTop);
    } else if (type === 'add') {
      this.drawUsers();
    } else if (type === 'delete') {
      this.drawUsers();
    }
  }

  sendMessage(message) {
    if (this.ws.readyState === WebSocket.OPEN) {
      const newMessage = {
        type: 'message',
        name: this.userName,
        msg: message,
        date: new Date(),
      };
      this.ws.send(JSON.stringify(newMessage));
    } else {
      this.ws = new WebSocket(this.url);
    }
  }

  async drawUsers() {
    const response = await this.api.loadUsers();
    const users = await response.json();
    const usersList = document.querySelector('.users');
    usersList.innerHTML = '';
    for (const user of users) {
      const newUser = document.createElement('div');
      newUser.classList.add('user');
      let activeUser = '';
      let { name } = user;
      if (user.name === this.userName) {
        activeUser = 'active_user';
        name = 'You';
      }
      newUser.innerHTML = `
      <div class="user_icon"></div>
      <div class="username ${activeUser}">${name}</div>
      `;
      usersList.appendChild(newUser);
    }
  }
}
