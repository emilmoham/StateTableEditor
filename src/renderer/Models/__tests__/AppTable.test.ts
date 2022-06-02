import AppTable from '../AppTable';
import SwitchState from '../SwitchState';

test('parse good header', () => {
  expect(AppTable.parseHeader('#$HEADER; NULL')).toBe(AppTable.READ_NEXT);
});

test('parse bad header', () => {
  expect(AppTable.parseHeader('#$HEADER;  NULL')).toBe(AppTable.READ_ERROR);
});

test('parse blank line', () => {
  expect(AppTable.parseNextLine('')).toBe(AppTable.READ_NEXT);
});

test('parse header start', () => {
  expect(
    AppTable.parseNextLine('****************************************')
  ).toBe(AppTable.READ_SECTION);
});

test('parse state single digit number', () => {
  expect(AppTable.parseNextLine('5')).toBe(AppTable.READ_STATE);
});

test('parse state multi digit number', () => {
  expect(AppTable.parseNextLine('51')).toBe(AppTable.READ_STATE);
});

test('parse unexpected input', () => {
  expect(AppTable.parseNextLine('a')).toBe(AppTable.READ_ERROR);
});

test('parse state good input', () => {
  const table = new AppTable();
  const input = '#$State ;Load; 0 3 3 3 3 3 ;[2] Load Stuff';
  expect(table.parseStateLine(input)).toBe(AppTable.READ_NEXT);
});

test('parse state bad input', () => {
  const table = new AppTable();
  const input = '#$State ';
  expect(table.parseStateLine(input)).toBe(AppTable.READ_ERROR);
});

test('parse section text normal description', () => {
  const table = new AppTable();
  expect(table.parseSection('*  Test(23s)? and more characters')).toBe(
    AppTable.READ_SECTION
  );
});

test('parse section end blank line', () => {
  const table = new AppTable();
  expect(table.parseSection('')).toBe(AppTable.READ_SECTION);
});

test('parse section end closing border', () => {
  const table = new AppTable();
  expect(table.parseSection('****************************************')).toBe(
    AppTable.READ_NEXT
  );
});

test('parse section end unexpected characters', () => {
  const table = new AppTable();
  expect(table.parseSection('#$S')).toBe(AppTable.READ_ERROR);
});

test('get state count', () => {
  const table = new AppTable();
  expect(table.stateCount).toBe(0);
});

test('insert state no args as first state', () => {
  const table = new AppTable();
  const rc = table.insertState();
  expect(rc).toBe(true);
  expect(table.stateCount).toBe(1);
});

test('insert state no args as state 2+', () => {
  const table = new AppTable();
  let rc = table.insertState();
  expect(rc).toBe(true);
  expect(table.stateCount).toBe(1);
  rc = table.insertState();
  expect(rc).toBe(false);
  expect(table.stateCount).toBe(1);
});

test('insert state before valid state', () => {
  const table = new AppTable();
  let rc = table.insertState();
  expect(rc).toBe(true);
  const parentState = table.stateMap[0];
  rc = table.insertState(parentState, false);
  expect(rc).toBe(true);
  expect(table.stateCount).toBe(2);
  expect(parentState).toStrictEqual(table.stateMap[1]);
});

test('insert state after valid state', () => {
  const table = new AppTable();
  let rc = table.insertState();
  expect(rc).toBe(true);
  const parentState = table.stateMap[0];
  rc = table.insertState(parentState, true);
  expect(rc).toBe(true);
  expect(table.stateCount).toBe(2);
  expect(parentState).toStrictEqual(table.stateMap[0]);
});

test('insert state before invalid state', () => {
  const table = new AppTable();
  let rc = table.insertState();
  expect(rc).toBe(true);

  const invalidState = new SwitchState('invalidState', [], [], 'invalid state');

  rc = table.insertState(
    invalidState,
    false,
    new SwitchState('state2', [], [], 'state 2')
  );
  expect(rc).toBe(false);
});

test('insert state after invalid state', () => {
  const table = new AppTable();
  let rc = table.insertState();
  expect(rc).toBe(true);

  const invalidState = new SwitchState('invalidState', [], [], 'invalid state');

  rc = table.insertState(
    invalidState,
    true,
    new SwitchState('state2', [], [], 'state 2')
  );
  expect(rc).toBe(false);
});

test('delete invalid state', () => {
  const table = new AppTable();
  const invalidState = new SwitchState('invalidState', [], [], 'invalid state');
  const rc = table.deleteState(invalidState);
  expect(rc).toBe(false);
});

test('delete state single state exists', () => {
  const table = new AppTable();

  let rc = table.insertState();
  expect(rc).toBe(true);
  expect(table.stateCount).toBe(1);

  const state = table.stateMap[0];
  rc = table.deleteState(state);

  expect(rc).toBe(true);
  expect(table.stateCount).toBe(0);
});

test('delete state no replacement multiple states exist', () => {
  const table = new AppTable();

  let rc = table.insertState();
  expect(rc).toBe(true);

  const parentState = table.stateMap[0];
  rc = table.insertState(parentState, true);
  expect(rc).toBe(true);
  expect(table.stateCount).toBe(2);

  const state = table.stateMap[0];
  rc = table.deleteState(state);

  expect(rc).toBe(false);
  expect(table.stateCount).toBe(2);
});

test('delete state single state exists point to invalid state', () => {
  const table = new AppTable();

  let rc = table.insertState();
  expect(rc).toBe(true);
  expect(table.stateCount).toBe(1);

  const state = table.stateMap[0];
  const invalidState = new SwitchState('invalidState', [], [], 'invalid state');
  rc = table.deleteState(state, invalidState);
  expect(rc).toBe(true);
  expect(table.stateCount).toBe(0);
});

test('delete state multiple states exist point to invalid state', () => {
  const table = new AppTable();

  let rc = table.insertState();
  expect(rc).toBe(true);

  const parentState = table.stateMap[0];

  rc = table.insertState(parentState, true);
  expect(rc).toBe(true);
  expect(table.stateCount).toBe(2);

  const invalidState = new SwitchState('invalidState', [], [], 'invalid state');

  rc = table.deleteState(parentState, invalidState);
  expect(rc).toBe(false);

  expect(table.stateCount).toBe(2);
});

test('delete state point to valid state', () => {
  const table = new AppTable();

  let rc = table.insertState(
    null,
    true,
    new SwitchState('state0', [], [], 'state 0')
  );
  expect(rc).toBe(true);
  const state0 = table.stateMap[0];

  rc = table.insertState(
    state0,
    true,
    new SwitchState('state1', [], [], 'state 1')
  );
  expect(rc).toBe(true);
  const state1 = table.stateMap[1];

  rc = table.insertState(
    state1,
    true,
    new SwitchState('state2', [], [], 'state 2')
  );
  expect(rc).toBe(true);
  const state2 = table.stateMap[2];

  state0.setReturnState(0, state0);
  state0.setReturnState(1, state1);
  state0.setReturnState(2, state1); // 0 1 1
  state1.setReturnState(0, state0);
  state1.setReturnState(1, state2);
  state1.setReturnState(2, state2); // 0 2 2
  state2.setReturnState(0, state0);
  state2.setReturnState(1, state2);
  state2.setReturnState(2, state1); // 0 2 1

  expect(state0.returnStateRefs[1].name).toBe('state1');
  expect(state0.returnStateRefs[2].name).toBe('state1');
  expect(state2.returnStateRefs[2].name).toBe('state1');

  rc = table.deleteState(state1, state0);
  expect(rc).toBe(true);

  expect(table.stateCount).toBe(2);

  expect(state0.returnStateRefs[1].name).toBe('state0');
  expect(state0.returnStateRefs[2].name).toBe('state0');
  expect(state2.returnStateRefs[2].name).toBe('state0');
});

test('insert section single line', () => {
  const sectionLines = ['test'];
  const table = new AppTable();
  let rc = table.insertState(
    null,
    false,
    new SwitchState('state0', [], [], 'state 0')
  );
  expect(rc).toBe(true);
  const lastState = table.stateMap[0];

  rc = table.insertSection(lastState, sectionLines);
  expect(rc).toBe(true);
  expect(table.sectionMap.get(lastState)?.descriptionLines).toBe(sectionLines);
});

test('insert section multiple lines', () => {
  const sectionLines = ['test', 'other test'];
  const table = new AppTable();
  let rc = table.insertState(
    null,
    false,
    new SwitchState('state0', [], [], 'state 0')
  );
  expect(rc).toBe(true);
  const lastState = table.stateMap[0];

  rc = table.insertSection(lastState, sectionLines);
  expect(rc).toBe(true);
  expect(table.sectionMap.get(lastState)?.descriptionLines).toBe(sectionLines);
});

test('insert section invalid after state', () => {
  const sectionLines = ['test'];
  const table = new AppTable();

  const invalidState = new SwitchState('invalidState', [], [], 'invalid state');

  const rc = table.insertSection(invalidState, sectionLines);
  expect(rc).toBe(false);
});

test('insert section at state already before another section', () => {
  const sectionLines = ['test'];
  const table = new AppTable();
  let rc = table.insertState(
    null,
    false,
    new SwitchState('state0', [], [], 'state 0')
  );
  expect(rc).toBe(true);
  const lastState = table.stateMap[0];

  rc = table.insertSection(lastState, sectionLines);
  expect(rc).toBe(true);

  rc = table.insertSection(lastState, sectionLines);
  expect(rc).toBe(false);
});

test('delete valid section', () => {
  const table = new AppTable();
  let rc = table.insertState(
    null,
    false,
    new SwitchState('state0', [], [], 'state 0')
  );
  expect(rc).toBe(true);

  const lastState = table.stateMap[0];
  rc = table.insertSection(lastState, ['test']);
  expect(rc).toBe(true);
  const section = table.sectionMap.get(lastState);
  if (section != null) rc = table.deleteSection(section);
  expect(rc).toBe(true);
});

test('delete invalid section', () => {
  const table = new AppTable();
  let rc = table.insertState(
    null,
    false,
    new SwitchState('state0', [], [], 'state 0')
  );
  expect(rc).toBe(true);

  const lastState = table.stateMap[0];
  rc = table.insertSection(lastState, ['test']);
  expect(rc).toBe(true);
  const section = table.sectionMap.get(lastState);
  if (section != null) rc = table.deleteSection(section);
  expect(rc).toBe(true);
  if (section != null) rc = table.deleteSection(section);
  expect(rc).toBe(false);
});

test('insert state after a state before section', () => {
  const table = new AppTable();

  let rc = table.insertState(
    null,
    false,
    new SwitchState('state0', [], [], 'state 0')
  );
  expect(rc).toBe(true);

  const parentState = table.stateMap[0];
  rc = table.insertSection(parentState, ['test']);
  expect(rc).toBe(true);
  const section = table.sectionMap.get(parentState);
  expect(section?.parentState).toBe(parentState);

  rc = table.insertState(
    parentState,
    true,
    new SwitchState('state1', [], [], 'state 1')
  );
  const childState = table.stateMap[1];
  expect(section?.parentState).toBe(childState);
});

test('duplicate valid state before', () => {
  const table = new AppTable();
  const originalState = new SwitchState('state0', [], [], 'state 0');
  table.insertState(null, false, originalState);
  const rc = table.duplicateState(originalState, originalState, false);
  expect(rc).toBe(true);
  expect(table.stateCount).toBe(2);
  expect(table.stateMap[0]).not.toBe(originalState);
  expect(table.stateMap[1]).toBe(originalState);
});

test('duplicate valid state after', () => {
  const table = new AppTable();
  const originalState = new SwitchState('state0', [], [], 'state 0');
  table.insertState(null, false, originalState);
  const rc = table.duplicateState(originalState, originalState, true);
  expect(rc).toBe(true);
  expect(table.stateCount).toBe(2);
  expect(table.stateMap[0]).toBe(originalState);
  expect(table.stateMap[1]).not.toBe(originalState);
});

test('duplicate state invalid original state', () => {
  const table = new AppTable();
  const originalState = new SwitchState('state0', [], [], 'state 0');
  table.insertState(null, false, originalState);

  const invalidState = new SwitchState('invalidState', [], [], 'invalid state');

  const rc = table.duplicateState(invalidState, originalState, true);
  expect(rc).toBe(false);
});

test('duplicate state invalid target parent', () => {
  const table = new AppTable();
  const originalState = new SwitchState('state0', [], [], 'state 0');
  table.insertState(null, false, originalState);

  const invalidState = new SwitchState('invalidState', [], [], 'invalid state');

  const rc = table.duplicateState(originalState, invalidState, true);
  expect(rc).toBe(false);
});

test('duplicate self referencing state', () => {
  const table = new AppTable();
  const state0 = new SwitchState('state0', [], [], 'state 0');
  const state1 = new SwitchState('state1', [], [], 'state 1');

  table.insertState(null, false, state0);
  table.insertState(state0, true, state1);

  state0.setReturnState(0, state0);
  state0.setReturnState(1, state1);
  state0.setReturnState(2, state1);

  state1.setReturnState(0, state0);
  state1.setReturnState(1, state1);
  state1.setReturnState(2, state1);

  const rc = table.duplicateState(state1, state1, true);
  expect(rc).toBe(true);
  const state2 = table.stateMap[2];
  expect(state2.returnStateRefs.length).toBe(3);
  expect(state2.returnStateRefs[0]).toBe(state0);
  expect(state2.returnStateRefs[1]).toBe(state2);
  expect(state2.returnStateRefs[2]).toBe(state2);
  expect(state1.returnStateRefs[1]).toBe(state1);
});

test('duplicate range before new parent', () => {
  const table = new AppTable();

  const state0 = new SwitchState('state0', [], [], 'state0');
  const state1 = new SwitchState('state1', [], [], 'state1');
  const state2 = new SwitchState('state2', [], [], 'state2');
  const state3 = new SwitchState('state3', [], [], 'state3');

  table.insertState(null, false, state0);
  table.insertState(state0, true, state1);
  table.insertState(state1, true, state2);
  table.insertState(state2, true, state3);

  expect(table.stateCount).toBe(4);
  const rc = table.duplicateRange(state1, state3, state3, false);
  expect(rc).toBe(true);
  expect(table.stateCount).toBe(7);
  expect(table.stateMap[3]).not.toBe(state3);
  expect(table.stateMap[6]).toBe(state3);
});

test('duplicate range after new parent', () => {
  const table = new AppTable();

  const state0 = new SwitchState('state0', [], [], 'state0');
  const state1 = new SwitchState('state1', [], [], 'state1');
  const state2 = new SwitchState('state2', [], [], 'state2');
  const state3 = new SwitchState('state3', [], [], 'state3');

  table.insertState(null, false, state0);
  table.insertState(state0, true, state1);
  table.insertState(state1, true, state2);
  table.insertState(state2, true, state3);

  expect(table.stateCount).toBe(4);
  const rc = table.duplicateRange(state1, state3, state3, true);
  expect(rc).toBe(true);
  expect(table.stateCount).toBe(7);
  expect(table.stateMap[3]).toBe(state3);
  expect(table.stateMap[6]).not.toBe(state3);
});

test('duplicate range invalid start state', () => {
  const table = new AppTable();

  const state0 = new SwitchState('state0', [], [], 'state0');
  const state1 = new SwitchState('state1', [], [], 'state1');
  const state2 = new SwitchState('state2', [], [], 'state2');
  const state3 = new SwitchState('state3', [], [], 'state3');

  table.insertState(null, false, state0);
  table.insertState(state0, true, state1);
  table.insertState(state1, true, state2);
  table.insertState(state2, true, state3);

  expect(table.stateCount).toBe(4);

  const invalidState = new SwitchState('invalidState', [], [], 'invalid state');

  const rc = table.duplicateRange(invalidState, state3, state3, true);
  expect(rc).toBe(false);
  expect(table.stateCount).toBe(4);
});

test('duplicate range invalid end state', () => {
  const table = new AppTable();

  const state0 = new SwitchState('state0', [], [], 'state0');
  const state1 = new SwitchState('state1', [], [], 'state1');
  const state2 = new SwitchState('state2', [], [], 'state2');
  const state3 = new SwitchState('state3', [], [], 'state3');

  table.insertState(null, false, state0);
  table.insertState(state0, true, state1);
  table.insertState(state1, true, state2);
  table.insertState(state2, true, state3);

  expect(table.stateCount).toBe(4);

  const invalidState = new SwitchState('invalidState', [], [], 'invalid state');

  const rc = table.duplicateRange(state1, invalidState, state3, true);
  expect(rc).toBe(false);
  expect(table.stateCount).toBe(4);
});

test('duplicate range internal references', () => {
  const table = new AppTable();

  const state0 = new SwitchState('state0', [], [], 'state0'); // 0 1 1
  const state1 = new SwitchState('state1', [], [], 'state1'); // 0 2 2
  const state2 = new SwitchState('state2', [], [], 'state2'); // 0 1 3
  const state3 = new SwitchState('state3', [], [], 'state3'); // 0 1 1

  table.insertState(null, false, state0);
  table.insertState(state0, true, state1);
  table.insertState(state1, true, state2);
  table.insertState(state2, true, state3);

  state0.setReturnState(0, state0);
  state0.setReturnState(1, state1);
  state0.setReturnState(2, state1);
  state1.setReturnState(0, state0);
  state1.setReturnState(1, state2);
  state1.setReturnState(2, state2);
  state2.setReturnState(0, state0);
  state2.setReturnState(1, state1);
  state2.setReturnState(2, state3);
  state3.setReturnState(0, state0);
  state3.setReturnState(1, state1);
  state3.setReturnState(2, state1);

  expect(table.stateCount).toBe(4);
  const rc = table.duplicateRange(state1, state3, state3, false);
  expect(rc).toBe(true);
  expect(table.stateCount).toBe(7);

  const state4 = table.stateMap[3]; // 0 5 5
  const state5 = table.stateMap[4]; // 0 4 6
  const state6 = table.stateMap[5]; // 0 4 4

  expect(table.stateMap[6]).toBe(state3);
  expect(table.stateMap[4]).toBe(state5);
  expect(state5.returnStateRefs[0]).toBe(state0);
  expect(state5.returnStateRefs[1]).toBe(state4);
  expect(state5.returnStateRefs[2]).toBe(state6);
});
