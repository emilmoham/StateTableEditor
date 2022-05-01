class SwitchState {
    constructor (id, name, returnStates, description) {
        this.id = id;
        this.name = name;
        this.returnStates = returnStates;
        this.description = description;
    }

    SetReturnState(index, state, fillState){
        if (index > 20)
            return false;

        if(this.returnStates.length > index) {
            this.returnStates[index] = state;
        } else {
            for(let i = this.returnStates.length; i < index; i++ )
                this.returnStates.push(fillState);
            this.returnStates.push(state);
        }

        return true;
    }

    static parseState(text){
        const data = text.match(/#\$State ;(\w{0,})[\ ]?;([\ \d]{0,});\[(\d+)\]\ (.{0,})/);
        
        if(!data)
            return null;

        const stateName = data[1];
        const returnStates = data[2].trim().split(' ').map(Number);
        const stateId = parseInt(data[3]);
        const stateDesc = data[4];

        return new SwitchState(stateId, stateName, returnStates, stateDesc);
    }

    format() {
        return `#$State ;${this.name}; ${this.returnStates.join(' ')} ;[${this.id}] ${this.description}`
    }
}

module.exports = SwitchState;