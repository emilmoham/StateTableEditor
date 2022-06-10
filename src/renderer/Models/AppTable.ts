import Section from './Section';
import SwitchState from './SwitchState';

const READ_ERROR = -1;
const READ_HEADER = 0;
const READ_NEXT = 1;
const READ_STATE = 2;
const READ_SECTION = 3;

export default class AppTable {
  filename: string;

  stateMap: SwitchState[];

  // sectionMap: Map<SwitchState, Section>;
  renderables: (SwitchState | Section)[];

  constructor(filename = 'sample.app') {
    this.filename = filename;
    this.stateMap = [];
    this.renderables = [];
  }

  static get READ_ERROR(): number {
    return READ_ERROR;
  }

  static get READ_HEADER(): number {
    return READ_HEADER;
  }

  static get READ_NEXT(): number {
    return READ_NEXT;
  }

  static get READ_STATE(): number {
    return READ_STATE;
  }

  static get READ_SECTION(): number {
    return READ_SECTION;
  }

  get stateCount(): number {
    return this.stateMap.length;
  }

  static parseHeader(line: string) {
    return line === '#$HEADER; NULL' ? READ_NEXT : READ_ERROR;
  }

  static parseNextLine(line: string) {
    if (line.length === 0) {
      return READ_NEXT;
    }

    if (line[0] === '*') {
      return READ_SECTION;
    }

    if (line.match(/\d+/)) {
      return READ_STATE;
    }

    return READ_ERROR;
  }

  parseStateLine(line: string) {
    const data = SwitchState.parseState(line);
    if (!data) return READ_ERROR;
    this.stateMap.push(data);
    this.renderables.push(data);
    return READ_NEXT;
  }

  parseSection(line: string) {
    if (line.length === 0) return READ_SECTION;

    if (line.length > 0 && !line.match(/\*{1,}(\s{2,})?/)) return READ_ERROR;

    if (line.match(/\*{3,}/)) {
      return READ_NEXT;
    }

    let lastRenderable: SwitchState | Section | undefined;

    if (this.renderables.length > 0) {
      lastRenderable = this.renderables[this.renderables.length - 1];
    }

    let section: Section | undefined;
    if (lastRenderable === undefined || lastRenderable instanceof SwitchState) {
      section = new Section([]);
      this.renderables.push(section);
    } else {
      section = lastRenderable;
    }

    section.parseDescriptionLine(line);

    return READ_SECTION;
  }

  read(rawData: string) {
    const lines = rawData.split(/\r?\n/);

    let parseState = READ_HEADER;

    for (let i = 0; i < lines.length; i += 1) {
      if (parseState === READ_ERROR) return false;

      const line = lines[i];

      switch (parseState) {
        case READ_ERROR:
          break;
        case READ_HEADER:
          parseState = AppTable.parseHeader(line);
          break;
        case READ_NEXT:
          parseState = AppTable.parseNextLine(line);
          break;
        case READ_STATE:
          parseState = this.parseStateLine(line);
          break;
        case READ_SECTION:
          parseState = this.parseSection(line);
          break;
        default:
          break;
      }
    }

    this.resolveAllStateReferences();

    return true;
  }

  print(): void {
    let outBytes = '';
    for (let i = 0; i < this.renderables.length; i += 1) {
      const renderable = this.renderables[i];
      if (renderable instanceof SwitchState) {
        outBytes = outBytes.concat(i.toString());
        outBytes = outBytes.concat('\n');
        outBytes = outBytes.concat(renderable.format(i));
        outBytes = outBytes.concat('\n');
      } else if (renderable instanceof Section) {
        outBytes = outBytes.concat(`\n${renderable.format()}\n`);
      }
    }
  }

  resolveAllStateReturnIds(): void {
    this.stateMap.forEach((element) => {
      element.resolveReturnStateIds(this.stateMap);
    });
  }

  resolveAllStateReferences(): void {
    this.stateMap.forEach((element) => {
      element.resolveReturnStateReferences(this.stateMap);
    });
  }

  insertState(
    parentState: SwitchState | null = null,
    after = true,
    state: SwitchState = new SwitchState('myNewState', [], [], 'myNewState')
  ): boolean {
    if (this.stateCount === 0) {
      this.stateMap.push(state);
      this.renderables.push(state);
      return true;
    }

    if (parentState == null) return false;

    const parentStateMapIndex = this.stateMap.indexOf(parentState);
    const parentRenderableIndex = this.renderables.indexOf(parentState);

    if (parentStateMapIndex === -1 || parentRenderableIndex === -1)
      return false;

    this.stateMap.splice(parentStateMapIndex + (after ? 1 : 0), 0, state);
    this.renderables.splice(parentRenderableIndex + (after ? 1 : 0), 0, state);

    return true;
  }

  deleteState(state: SwitchState, replacementState: SwitchState | null = null) {
    const stateIndex = this.stateMap.indexOf(state);
    const renderableIndex = this.renderables.indexOf(state);
    const replacementStateIndex =
      replacementState == null ? -1 : this.stateMap.indexOf(replacementState);

    if (
      stateIndex === -1 ||
      (replacementStateIndex === -1 && this.stateCount > 1)
    )
      return false;

    if (this.stateCount === 1 && stateIndex === 0) {
      this.stateMap.splice(stateIndex, 1);
      this.renderables.splice(renderableIndex, 1);
      return true;
    }

    if (replacementState == null) return false;

    state.callers.forEach((_count, caller) => {
      for (let i = 0; i < caller.returnStateRefs.length; i += 1) {
        if (caller.returnStateRefs[i] === state) {
          caller.setReturnState(i, replacementState);
        }
      }
    });

    this.stateMap.splice(stateIndex, 1);
    this.renderables.splice(renderableIndex, 1);
    return true;
  }

  insertSection(state: SwitchState, after: boolean, sectionLines: string[]) {
    if (state == null || sectionLines == null) return false;

    const index = this.renderables.indexOf(state);
    if (this.stateMap.indexOf(state) === -1 || index === -1) return false;

    const section = new Section(sectionLines);
    this.renderables.splice(index + (after ? 1 : 0), 0, section);
    return true;
  }

  deleteSection(section: Section): boolean {
    const index = this.renderables.indexOf(section);
    if (index === -1) return false;
    this.renderables.splice(index, 1);
    return true;
  }

  duplicateState(
    originalState: SwitchState,
    targetParentState: SwitchState,
    after: boolean
  ) {
    if (
      this.stateMap.indexOf(originalState) === -1 ||
      this.stateMap.indexOf(targetParentState) === -1
    )
      return false;

    // Create a copy of the original state
    const copyState = new SwitchState(
      originalState.name,
      [],
      [],
      originalState.description
    );

    // Replace any return references to the original state with the new state
    for (let i = 0; i < originalState.returnStateRefs.length; i += 1) {
      const returnStateRef = originalState.returnStateRefs[i];
      if (returnStateRef === originalState) {
        copyState.setReturnState(i, copyState);
      } else {
        copyState.setReturnState(i, returnStateRef);
      }
    }

    // Place the new state in the map at target Index
    return this.insertState(targetParentState, after, copyState);
  }

  duplicateRange(
    startState: SwitchState,
    endState: SwitchState,
    parent: SwitchState,
    after: boolean
  ) {
    const startIndex = this.stateMap.indexOf(startState);
    const endIndex = this.stateMap.indexOf(endState);
    const parentIndex = this.stateMap.indexOf(parent);

    if (
      startIndex === -1 ||
      endIndex === -1 ||
      parentIndex === -1 ||
      endIndex - startIndex < 0
    )
      return false;

    const originalStates = [];
    const copyStates = [];
    for (let i = startIndex; i <= endIndex; i += 1) {
      const currentState = this.stateMap[i];
      originalStates.push(currentState);
      copyStates.push(
        new SwitchState(currentState.name, [], [], currentState.description)
      );
    }

    for (let i = 0; i < originalStates.length; i += 1) {
      const original = originalStates[i];
      const copy = copyStates[i];
      for (let j = 0; j < original.returnStateRefs.length; j += 1) {
        const returnStateRef = original.returnStateRefs[j];
        const internalIndex = originalStates.indexOf(returnStateRef);
        if (internalIndex !== -1)
          copy.setReturnState(j, copyStates[internalIndex]);
        else copy.setReturnState(j, returnStateRef);
      }
    }

    for (let i = 0; i < copyStates.length; i += 1) {
      const rc = this.insertState(parent, after, copyStates[i]);
      if (!rc) return false;
    }

    return true;
  }
}
