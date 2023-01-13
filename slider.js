export default class Slider {
  constructor() {
    this.grid = document.querySelector(".cards");
    this.gridChildren = [...this.grid.children];
    this.currentOrder = [0, 0, 0.5, 1, 1, 0.5, 0, 0];
    this.possibleClasses = [
      "hidden-card",
      "overflowing-card",
      "centered-option",
    ];

    this.positionClasses = [
      [this.possibleClasses[0]],
      [this.possibleClasses[0]],
      [this.possibleClasses[1]],
      [this.possibleClasses[2]],
      [this.possibleClasses[2]],
      [this.possibleClasses[1]],
      [this.possibleClasses[0]],
      [this.possibleClasses[0]],
    ];

    this.leftScroller = document.querySelector(".left-scroller");
    this.rightScroller = document.querySelector(".right-scroller");

    //Listeners
    this.leftScroller.addEventListener("click", () => {
      console.log("scroll left");
      this.scroll("l");
    });

    this.rightScroller.addEventListener("click", () => {
      console.log("Scroll right");
      this.scroll("r");
    });

    this.addClasses().then((_) => {
      // Display none to grid once style init
      this.grid.style.display = "grid";
    });
  }

  async addClasses() {
    for (const [i, el] of this.gridChildren.entries()) {
      el.classList.add(this.positionClasses[i]);
    }
  }

  // inplace removal of the scrollers positional classes (left,center,overflow,right,hidden)
  _clearPositionalClasses(domElement) {
    this.possibleClasses.map((classes) => {
      domElement.classList.remove(classes);
    });
  }

  _createGridTemplateColumnsString() {
    let outputString = "";
    this.currentOrder.map((w) => {
      outputString += w + "fr ";
    });
    return outputString;
  }

  scroll(direction) {
    const left = direction === "l" ? true : false;

    if (left) {
      if (this.currentOrder[0] === 1) {
        return;
      }

      this.currentOrder = this.currentOrder.slice(1);
      this.positionClasses = this.positionClasses.slice(1);

      if (this.currentOrder.at(-1) === 1) {
        this.currentOrder.push(0.5);
        this.positionClasses.push(this.possibleClasses[1]);
      } else {
        this.currentOrder.push(0);
        this.positionClasses.push(this.possibleClasses[0]);
      }

      this.gridChildren.map((el) => this._clearPositionalClasses(el));
      this.addClasses();

      this.grid.style.gridTemplateColumns =
        this._createGridTemplateColumnsString();
      console.log(this.grid.style.gridTemplateColumns);
      return;
    }
    if (this.currentOrder.at(-1) === 1) {
      return;
    }

    this.positionClasses = this.positionClasses.slice(0, -1);
    this.currentOrder = this.currentOrder.slice(0, -1);

    if (this.currentOrder.at(0) === 1) {
      console.log("adding .5");
      this.currentOrder.unshift(0.5);
      this.positionClasses.unshift(this.possibleClasses[1]);
    } else {
      this.currentOrder.unshift(0);
      this.positionClasses.unshift(this.possibleClasses[0]);
    }

    this.gridChildren.map((el) => this._clearPositionalClasses(el));
    this.addClasses();
    this.grid.style.gridTemplateColumns =
      this._createGridTemplateColumnsString();
  }
}
