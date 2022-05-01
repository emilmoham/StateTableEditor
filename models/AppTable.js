const fs = require('fs')

const READ_ERROR = -1;
const READ_HEADER = 0;
const READ_NEXT = 1;
const READ_STATE = 2;
const READ_SECTION_BEGIN = 3;
const READ_SECTION_END = 4;

class AppTable {
    
    constructor (filename = "sample.app") {
        this.filename = filename;
        this.stateMap = [];
    }

    static get READ_ERROR() { return READ_ERROR; }
    static get READ_HEADER() { return READ_HEADER; }
    static get READ_NEXT() { return READ_NEXT; }
    static get READ_STATE() { return READ_STATE; }
    static get READ_SECTION_BEGIN() { return READ_SECTION_BEGIN; }
    static get READ_SECTION_END() { return READ_SECTION_END; }

    parseHeader(line) {
        return line === "#$HEADER; NULL" ? READ_NEXT : READ_ERROR;
    }

    parseNextLine(line){
        if (line[0] == '*'){
            return READ_SECTION_BEGIN;
        } else if (line.match(/\d+/)) {
            return READ_STATE;
        } else if (line == "") {
            return READ_NEXT;
        } else {
            return READ_ERROR;
        }
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
                    const data = SwitchState.parseState(line);
                    if (!data)
                        parseState = READ_ERROR;

                    parseState = READ_NEXT;
                    break;
                case READ_SECTION_BEGIN:
                    console.log(line)
                    parseState= READ_SECTION_END;
                    break;
                case READ_SECTION_END:
                    if(line.match(/\*{3,}/)){
                        parseState = READ_NEXT;
                    }
                    break;
            }
        });

        return true;
    }

    show() {
        this.stateMap.forEach(element => {
            console.log(element);
        });
    }
}

module.exports = AppTable;