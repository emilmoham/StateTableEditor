export class Section {
    constructor (header){
        this.header = header;
        this.states = []
    }

    format() {
        return `****************************************\n*  ${this.header}\n\n****************************************`
    }
}