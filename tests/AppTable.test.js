const AppTable = require('../models/AppTable.js')

test('parse good header', () => {
    const table = new AppTable("");
    expect(table.parseHeader("#$HEADER; NULL")).toBe(AppTable.READ_NEXT);
});


test('parse bad header', () => {
    const table = new AppTable("");
    expect(table.parseHeader("#$HEADER;  NULL")).toBe(AppTable.READ_ERROR);
});

test('parse blank line', () => {
    const table = new AppTable();
    expect(table.parseNextLine("")).toBe(AppTable.READ_NEXT);
});

test('parse header start', () => {
    const table = new AppTable();
    expect(table.parseNextLine("****************************************")).toBe(AppTable.READ_SECTION);
});

test('parse state single digit number', () => {
    const table = new AppTable();
    expect(table.parseNextLine("5")).toBe(AppTable.READ_STATE);
});

test('parse state multi digit number', () => {
    const table = new AppTable();
    expect(table.parseNextLine("50")).toBe(AppTable.READ_STATE);
});

test('parse unexpected input', () =>{
    const table = new AppTable();
    expect(table.parseNextLine("a")).toBe(AppTable.READ_ERROR);
});

test('parse state good input', () => {
    const table = new AppTable();
    const input = "#$State ;Load; 0 3 3 3 3 3 ;[2] Load Stuff"
    expect(table.parseStateLine(input)).toBe(AppTable.READ_NEXT);
});

test('parse state bad input', () => {
    const table = new AppTable();
    const input = "#$State "
    expect(table.parseStateLine(input)).toBe(AppTable.READ_ERROR);
});

test('parse section text normal description', () => {
    const table = new AppTable();
    expect(table.parseSection("*  Test(23s)? and more characters")).toBe(AppTable.READ_SECTION);
});

test('parse section end blank line', () => {
    const table = new AppTable();
    expect(table.parseSection("")).toBe(AppTable.READ_SECTION);
});

test('parse section end closing border', () => {
    const table = new AppTable();
    expect(table.parseSection("****************************************")).toBe(AppTable.READ_NEXT);
});

test('parse section end unexpected characters', () => {
    const table = new AppTable();
    expect(table.parseSection("#$S")).toBe(AppTable.READ_ERROR);
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

test('insert state before valid state', () =>{ 
    const table = new AppTable();
    let rc = table.insertState();
    expect(rc).toBe(true);
    const parentState = table.stateMap[0];
    rc = table.insertState(parentState, false);
    expect(rc).toBe(true);
    expect(table.stateCount).toBe(2);
    expect(parentState).toStrictEqual(table.stateMap[1]);
});

test('insert state after valid state', () =>{ 
    const table = new AppTable();
    let rc = table.insertState();
    expect(rc).toBe(true);
    const parentState = table.stateMap[0];
    rc = table.insertState(parentState, true);
    expect(rc).toBe(true);
    expect(table.stateCount).toBe(2);
    expect(parentState).toStrictEqual(table.stateMap[0]);
});

test('insert state before invalid state', () =>{ 
    const table = new AppTable();
    let rc = table.insertState();
    expect(rc).toBe(true);
    rc = table.insertState(table, false, "state2", "state 2");
    expect(rc).toBe(false);
});

test('insert state after invalid state', () =>{ 
    const table = new AppTable();
    let rc = table.insertState();
    expect(rc).toBe(true);
    const parent = table.stateMap[0];
    rc = table.insertState(table, true, "state2", "state 2");
    expect(rc).toBe(false);
});

test('delete invlaid state', () => {
    const table = new AppTable();
    const rc = table.deleteSection(table);
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

test('delete state no replacement multiple states exist ', () => {
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
    rc = table.deleteState(state, table);
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

    rc = table.deleteState(parentState, table);
    expect(rc).toBe(false);

    expect(table.stateCount).toBe(2);
});

test('delete state point to valid state', () => {
    const table = new AppTable();

    let rc = table.insertState(null, true, "state0", "state 0");
    expect(rc).toBe(true);
    const state0 = table.stateMap[0];

    rc = table.insertState(state0, true, "state1", "state 1");
    expect(rc).toBe(true);
    const state1 = table.stateMap[1];

    rc = table.insertState(state1, true, "state2", "state 2");
    expect(rc).toBe(true);
    const state2 = table.stateMap[2];

    state0.setReturnState(0, state0);
    state0.setReturnState(1, state1);
    state0.setReturnState(2, state1);// 0 1 1 
    state1.setReturnState(0, state0);
    state1.setReturnState(1, state2);
    state1.setReturnState(2, state2);// 0 2 2
    state2.setReturnState(0, state0);
    state2.setReturnState(1, state2);
    state2.setReturnState(2, state1);// 0 2 1

    expect(state0.returnStateRefs[1].name).toBe("state1")
    expect(state0.returnStateRefs[2].name).toBe("state1");
    expect(state2.returnStateRefs[2].name).toBe("state1");

    rc = table.deleteState(state1, state0);
    expect(rc).toBe(true);
    
    expect(table.stateCount).toBe(2);

    expect(state0.returnStateRefs[1].name).toBe("state0")
    expect(state0.returnStateRefs[2].name).toBe("state0");
    expect(state2.returnStateRefs[2].name).toBe("state0");
});