export default class API {
  constructor(url) {
    this.url = url;
    this.contentTypeHeader = { 'Content-Type': 'application/json' };
  }

  loadUsers() {
    return fetch(this.url);
  }

  addUser(userName) {
    return fetch(this.url, {
      body: JSON.stringify(userName),
      method: 'POST',
      headers: this.contentTypeHeader,
    });
  }

  remove(userName) {
    return fetch(`${this.url}/${userName}`, {
      method: 'DELETE',
    });
  }
}
