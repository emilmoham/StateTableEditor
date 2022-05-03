const MAX_STATES = 20;
const MIN_STATES = 2;

class SwitchState {
    constructor (name, returnStateIds, returnStateRefs, description) {
        this.name = name;
        this.returnStateIds = returnStateIds;
        this.returnStateRefs = returnStateRefs;
        this.description = description;
    }

    static get MAX_STATES() { return MAX_STATES; }
    static get MIN_STATES() { return MIN_STATES; }

    resolveReturnStateIds(map) {
        this.returnStateIds = [];
        for(let i = 0; i < this.returnStateRefs.length; i++){
            const element = this.returnStateRefs[i];
            const index = map.indexOf(element);
            if(index == -1)
                return i;    
            this.returnStateIds.push(map.indexOf(element));
        }
        return -1;
    }

    resolveReturnStateReferences(map) {
        this.returnStateRefs = [];
        for(let i = 0; i < this.returnStateIds.length; i++){
            const element = this.returnStateIds[i];
            if (element >= map.length)
                return element;
            this.returnStateRefs.push(map[element]);
        }
        return -1;
    }

    static parseState(text){
        const data = text.match(/#\$State ;(\w{0,})[\ ]?;([\ \d]{0,});\[(\d+)\]\ (.{0,})/);
        
        if(!data)
            return null;

        const stateName = data[1];
        const returnStates = data[2].trim().split(' ').map(Number);
        if(returnStates.length < MIN_STATES || returnStates.length > MAX_STATES)
            return null;
        //const stateId = parseInt(data[3]);
        const stateDesc = data[4];

        return new SwitchState(stateName, returnStates, [], stateDesc);
    }

    format(id) {
        return `#$State ;${this.name}; ${this.returnStateIds.join(' ')} ;[${id}] ${this.description}`
    }

    setReturnState(index, state) {
        if(index >= MAX_STATES) return false;

        if (index < this.returnStateRefs.length) {
            this.returnStateRefs[index] = state;
            return true;
        } else if (index == this.returnStateRefs.length) {
            this.returnStateRefs.push(state);
            return true;
        }

        return false;
    }
}

module.exports = SwitchState;