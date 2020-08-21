class Cell {
    constructor(x, y, isBomb, $view) {
        this.x = x;
        this.y = y;
        this.isBomb = isBomb;
        this.isRevealed = false;

        this.$view = $view;

        this.neighbours = [];
    }

    reveal() {
        if (this.isRevealed)
            return;

        this.isRevealed = true;
        this.$view.classList.add('revealed');

        let numBombNeighbours = this.neighbours.filter(n => n.isBomb).length;

        if (this.isBomb) {
            this.$view.classList.add('bomb');
            return;
        }
        if (numBombNeighbours > 0)
            this.$view.innerHTML = numBombNeighbours;
        else
            this.neighbours.forEach(neighbour => {
                neighbour.reveal()
            });
    }
}