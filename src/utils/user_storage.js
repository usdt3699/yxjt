// This file is used to store and retrieve data from local storage
export default class UserStorage {
  static getToken() {
    return localStorage.getItem("user.Token");
  }

  static setToken(value) {
    return localStorage.setItem("user.Token", value);
  }

  static removeToken() {
    return localStorage.removeItem("user.Token");
  }

  static getNavList() {
    const data = localStorage.getItem("user.navList");
    try {
      if (data) {
        const menuList = JSON.parse(data);
        return menuList;
      }
    } catch (error) {}
    return null;
  }

  static setNavList(value) {
     localStorage.setItem("user.navList", JSON.stringify(value));
  }

  static removeNavList() {
    return localStorage.removeItem("user.navList");
  }
  static setConfig(value) {
    localStorage.setItem("site.config", JSON.stringify(value));
  }

  static getConfig() {
    return localStorage.getItem("site.config");
  }

}
