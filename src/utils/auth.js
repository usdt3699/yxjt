const localStorage = window.localStorage;
export default class Auth {
  static getEditableTabs() {
    return localStorage.getItem("user.editableTabs");
  }

  static setEditableTabs(value = []) {
    return localStorage.setItem("user.editableTabs", JSON.stringify(value));
  }

  static removeEditableTabs() {
    return localStorage.removeItem("user.editableTabs");
  }

  static getEditableTabsValue() {
    return localStorage.getItem("user.editableTabsValue");
  }

  static setEditableTabsValue(value) {
    return localStorage.setItem("user.editableTabsValue", value);
  }

  static removeEditableTabsValue() {
    return localStorage.removeItem("user.editableTabsValue");
  }

  static getToken() {
    return localStorage.getItem("user.Token");
  }

  static setToken(value) {
    return localStorage.setItem("user.Token", value);
  }

  static removeToken() {
    return localStorage.removeItem("user.Token");
  }
}
