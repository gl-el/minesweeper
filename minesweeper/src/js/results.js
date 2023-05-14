export default class Results {
  constructor() {
    this.results = localStorage.getItem('results') === null ? [] : JSON.parse(localStorage.getItem('results'));
  }

  addItem(state, size, qty, time, clicks) {
    console.log(this.results);
    this.results.push([state, size, qty, time, clicks]);
    if (this.results.length > 10) {
      this.results.shift();
    }
    localStorage.setItem('results', JSON.stringify(this.results));
  }

  getResults() {
    return this.results;
  }
}
