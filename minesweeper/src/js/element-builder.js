export default class Builder {
  constructor(elementType, attributes, parentElement, content) {
    this.elementType = elementType;
    this.attributes = attributes;
    this.parentElement = parentElement;
    this.content = content;
  }

  createElement() {
    const element = document.createElement(this.elementType);
    Object.keys(this.attributes).forEach((key) => {
      if (this.attributes[key]) element.setAttribute(key, this.attributes[key]);
    });
    element.textContent = this.content;
    return element;
  }

  insert() {
    const element = this.createElement();
    this.parentElement.append(element);
  }
}
