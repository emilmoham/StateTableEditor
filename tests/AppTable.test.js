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

// test('resolve all state return ids all references defined', () => {
//     const table = new AppTable();
//     expect(table.resolveAllStateReturnIds()).toBe(true);
// });

// test('resolve all state return ids missing reference', () => {
//     const table = new AppTable();
//     expect(table.resolveAllStateReturnIds()).toBe(true);
// });

// test('resolve all state return references all ids defined', () => {
//     const table = new AppTable();
//     expect(table.resolveAllStateReferences()).toBe(true);
// });

// test('resolve all state return ids missing id', () => {
//     const table = new AppTable();
//     expect(table.resolveAllStateReferences()).toBe(true);
// });

test('insert state no args as first state', () => {
    const table = new AppTable();
    const rc = table.insertState();
    expect(rc).toBe(true);
    expect(table.stateMap.length).toBe(1);
});

test('insert state no args as state 2+', () => {
    const table = new AppTable();
    let rc = table.insertState();
    expect(rc).toBe(true);
    expect(table.stateMap.length).toBe(1);
    rc = table.insertState();
    expect(rc).toBe(false);
    expect(table.stateMap.length).toBe(1);
});

// test('insert state before valid state', () =>{ 
//     const table = new AppTable();
//     const rc = table.insertState();
//     expect(rc).toBe(true);
// });

// test('insert state after valid state', () =>{ 
//     const table = new AppTable();
//     const rc = table.insertState();
//     expect(rc).toBe(true);
// });

// test('insert state before invalid state', () =>{ 
//     const table = new AppTable();
//     const rc = table.insertState();
//     expect(rc).toBe(true);
// });

// test('insert state after invalid state', () =>{ 
//     const table = new AppTable();
//     const rc = table.insertState();
//     expect(rc).toBe(true);
// });