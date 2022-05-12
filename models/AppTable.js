const fs = require('fs');
const Section = require('./Section.js');
const SwitchState = require('./SwitchState.js');

const READ_ERROR = -1;
const READ_HEADER = 0;
const READ_NEXT = 1;
const READ_STATE = 2;
const READ_SECTION = 3;

class AppTable {
    
    constructor (filename = "sample.app") {
        this.filename = filename;
        this.stateMap = [];
        this.sectionMap = new Map();
    }

    static get READ_ERROR() { return READ_ERROR; }
    static get READ_HEADER() { return READ_HEADER; }
    static get READ_NEXT() { return READ_NEXT; }
    static get READ_STATE() { return READ_STATE; }
    static get READ_SECTION() { return READ_SECTION; }

    get stateCount() { return this.stateMap.length; }

    parseHeader(line) {
        return line === "#$HEADER; NULL" ? READ_NEXT : READ_ERROR;
    }

    parseNextLine(line){
        if(line.length == 0){
            return READ_NEXT;
        } else if (line[0] == '*'){
            return READ_SECTION;
        } else if (line.match(/\d+/)) {
            return READ_STATE;
        } else {
            return READ_ERROR;
        }
    }

    parseStateLine(line) { 
        const data = SwitchState.parseState(line);
        if (!data)
            return READ_ERROR;
        this.stateMap.push(data);
        return READ_NEXT;
    }

    parseSection(line) {
        if(line.length == 0)
            return READ_SECTION;

        if(line.length > 0 && !line.match(/\*{1,}(\s{2,})?/))
            return READ_ERROR;
        
        const lastState = this.stateMap[this.stateMap.length - 1];

        if (line.match(/\*{3,}/)) {
            return READ_NEXT;
        }

        let section = this.sectionMap.get(lastState);
        if (section == undefined) {
            section = new Section(lastState);
            this.sectionMap.set(lastState, section);
        }
        section.parseDescriptionLine(line);

        return READ_SECTION;
    }

    read() {
        const appFile = fs.readFileSync(this.filename, 'utf-8');
        const lines = appFile.split(/\r?\n/);

        let parseState = READ_HEADER;

        lines.forEach(line => {
            switch(parseState) {
                case READ_ERROR:
                    return false;
                case READ_HEADER:
                    parseState = this.parseHeader(line);
                    break;
                case READ_NEXT:
                    parseState = this.parseNextLine(line);
                    break;
                case READ_STATE:
                    parseState = this.parseStateLine(line);
                    break;
                case READ_SECTION:
                    parseState = this.parseSection(line);
                    break;
            }
        });

        this.resolveAllStateReferences();

        return true;
    }

    print() {
        let outBytes = "";
        for(let i = 0; i < this.stateCount; i++) {
            const state = this.stateMap[i];

            outBytes = outBytes.concat(i);
            outBytes = outBytes.concat('\n');
            outBytes = outBytes.concat(state.format(i))
            outBytes = outBytes.concat('\n');

            
            const nextSection = this.sectionMap.get(state);
            if (nextSection != undefined) {
                outBytes = outBytes.concat(`\n${nextSection.format()}\n`);
            }
        }
        console.log(outBytes);
    }

    resolveAllStateReturnIds() { 
        this.stateMap.forEach(element => {
            element.resolveReturnStateIds(this.stateMap);
        });
    } 

    resolveAllStateReferences() { 
        this.stateMap.forEach(element => {
            element.resolveReturnStateReferences(this.stateMap)
        });
    }
    
    insertState(parentState = null, after = true, name = "myNewState", description = "myNewStateDescription") { 
        const state = new SwitchState(name, [], [], description);
        
        if(this.stateCount > 0 && parentState == null)
            return false; 
        
        let parentIndex = 0;
        if (parentState != null)
            parentIndex = this.stateMap.indexOf(parentState);
        
        if(parentIndex == -1)
            return false;

        if(after){
            parentIndex = parentIndex + 1;
            const section = this.sectionMap.get(parentState);
            if (section != undefined) {
                this.sectionMap.delete(parentState);
                section.parentState = state;
                this.sectionMap.set(state, section);
            }
        }

        this.stateMap.splice(parentIndex, 0, state);
        
        return true;
    }

    deleteState(state, replacementState=null) { 
        const stateIndex = this.stateMap.indexOf(state);
        const replacementStateIndex = this.stateMap.indexOf(replacementState); 

        if (stateIndex == -1 || (replacementStateIndex == -1 && this.stateCount > 1))
            return false;

        if (this.stateCount == 1 && stateIndex == 0) {
            this.stateMap.pop()
            return true;
        }

        state.callers.forEach((count, caller) => {
            for(let i = 0; i < caller.returnStateRefs.length; i++){
                if(caller.returnStateRefs[i] == state) {
                    caller.setReturnState(i, replacementState);
                }
            }
        });

        this.stateMap.splice(stateIndex, 1);
        return true; 
    }

    insertSection(afterState, sectionLines) {
        if(afterState == null || sectionLines == null)
            return false; 
        
        if(this.sectionMap.get(afterState) != null)
            return false;

        if(this.stateMap.indexOf(afterState) == -1)
            return false;
        
        const section = new Section(afterState, sectionLines);
        this.sectionMap.set(afterState, section);
        return true;
    }

    deleteSection(section) {
        return this.sectionMap.delete(section.parentState);
    }

    duplicateState() { return false; } // TODO
    duplicateRange() { return false; } // TODO
}

module.exports = AppTable;