import API from './API';
import ChatWidget from './ChatWidget';

const api = new API('https://chat-widget-sse-ws3.herokuapp.com/users');

const loginForm = document.querySelector('.login_form');
const enterBtn = loginForm.querySelector('.button');
const errorForm = document.querySelector('.error_wrapper');
const errorBtn = errorForm.querySelector('.button');

enterBtn.addEventListener('click', async () => {
  const loginInput = document.querySelector('.login_input');
  const login = loginInput.value;

  if (login) {
    const response = await api.loadUsers();
    const users = await response.json();

    if (users.findIndex((item) => item.name === login) === -1) {
      await api.addUser({ name: login });
      loginForm.classList.add('none');
      loginInput.value = '';
      const chatWidget = new ChatWidget(login);
      chatWidget.init();
      return;
    }
    errorForm.classList.remove('none');
  }
});

loginForm.addEventListener('keypress', async (event) => {
  if (event.key === 'Enter') {
    const loginInput = document.querySelector('.login_input');
    const login = loginInput.value;

    if (login) {
      const response = await api.loadUsers();
      const users = await response.json();

      if (users.findIndex((item) => item.name === login) === -1) {
        await api.addUser({ name: login });
        loginForm.classList.add('none');
        loginInput.value = '';
        const chatWidget = new ChatWidget(login);
        chatWidget.init();
        return;
      }
      errorForm.classList.remove('none');
    }
  }
});

errorBtn.addEventListener('click', () => {
  errorForm.classList.add('none');
});
