class Section {
    constructor (){
        this.descriptionLines = [];
        this.firstState = -1; 
    }

    parseDescriptionLine(line){
        const data = line.match(/\*\s{2}(.+)\r?\n?/)
        this.descriptionLines.push(data[1])
    }

    format() {
        let text = "";
        text = text.concat("****************************************");
        text = text.concat('\n');
        this.descriptionLines.forEach(element => {
            text = text.concat(`*  ${element}\n`);
        });
        text = text.concat("****************************************");
        return text;
    }
}

module.exports = Section;