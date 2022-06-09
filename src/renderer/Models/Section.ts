export default class Section {
  descriptionLines: string[];

  constructor(descriptionLines: string[] = []) {
    this.descriptionLines = descriptionLines;
  }

  parseDescriptionLine(line: string): void {
    const data = line.match(/\*\s{2}(.+)\r?\n?/);
    if (data !== null) this.descriptionLines.push(data[1]);
  }

  format(): string {
    let text = '';
    text = text.concat('****************************************');
    text = text.concat('\n');
    this.descriptionLines.forEach((element) => {
      text = text.concat(`*  ${element}\n`);
    });
    text = text.concat('\n****************************************');
    return text;
  }
}
