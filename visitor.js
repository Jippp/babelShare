/**
 * 具有稳定结构的对象
 */
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  accept(visitor) {
    visitor.visit(this);
  }
}

/**
 * 访问者
 */
class Visitor {
  constructor(type) {
    this.type = type;
  }

  visit(ele) {
    switch (this.type) {
      case 'name':
        console.log(ele.name);
        break;
      case 'age':
        ele.age++;
        console.log(ele.age);
        break;
    }
  }
}

// 具体的对象
const xiaoming = new Person('ming', 23);

// 具体的访问者
const nameVisitor = new Visitor('name');
const ageVisitor = new Visitor('age');

// 让对象接受不同的访问者
xiaoming.accept(nameVisitor);
xiaoming.accept(ageVisitor);
