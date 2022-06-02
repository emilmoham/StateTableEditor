import SwitchState from './SwitchState';

export default class Section {
  parentState: SwitchState;

  descriptionLines: string[];

  constructor(parentState: SwitchState, descriptionLines: string[] = []) {
    this.parentState = parentState;
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
