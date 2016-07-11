/**
 * Created by xaLT on 09.07.16.
 */
class User {

  constructor(name) {
    this.name = name;
  }

  get sayHi() {
    return this.name;
  }

}

let user = new User("Вася");
console.log(user.sayHi); // Вася