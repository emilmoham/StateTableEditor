const SwitchState = require("../models/SwitchState");

test('parse state single digit id ', () => {
    const state = SwitchState.parseState("#$State ;GetAppTrunk; 0 3 3 3 3 3 ;[2] Get Trunk Port");
    expect(state.name).toBe("GetAppTrunk");
    expect(state.returnStateIds).toStrictEqual([ 0, 3, 3, 3, 3, 3 ]);
    expect(state.description).toBe("Get Trunk Port");
});

test('parse state double digit id', () =>{
    const state = SwitchState.parseState("#$State ;RejectCall; 0 87 87 ;[13] Reject Unknown Inbound Call <6>");
    expect(state.name).toBe("RejectCall");
    expect(state.returnStateIds).toStrictEqual([ 0, 87, 87]);
    expect(state.description).toBe("Reject Unknown Inbound Call <6>");
});

test('malformed state', () => {
    const state = SwitchState.parseState("#$State;RejectCall; 0 87 87 ;[13] Reject Unknown Inbound Call <6>");
    expect(state).toBe(null);  
});

test('format', () => {
    const id = 13;
    const input = "#$State ;RejectCall; 0 87 87 ;[13] Reject Unknown Inbound Call <6>";
    const state = SwitchState.parseState(input);
    const output = state.format(id);
    expect(output).toBe(input);
});

test('too many return states', () => {
    const input = "#$State ;RejectCall; 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 ;[13] Too many Return states";
    const state = SwitchState.parseState(input); 
    expect(state).toBe(null);
});

test('no return states', () => {
    const input = "#$State ;RejectCall;   ;[13] No Return states";
    const state = SwitchState.parseState(input);
    expect(state).toBe(null);
}); 

test('resolve return state ids all defined', () => {
    const state0 = new SwitchState("state0", [], [], "test state 0");
    const state1 = new SwitchState("state1", [], [], "test state 1");

    state0.returnStateRefs = [state0, state1];
    state1.returnStateRefs = [state1, state0];

    const map = [state0, state1];

    const state0rc = state0.resolveReturnStateIds(map);
    const state1rc = state1.resolveReturnStateIds(map);

    expect(state0rc).toBe(-1);
    expect(state0.returnStateIds).toStrictEqual([0,1]);
    expect(state1rc).toBe(-1);
    expect(state1.returnStateIds).toStrictEqual([1,0]);

});

test('resolve return state ids map incomplete', () => {
    const state0 = new SwitchState("state0", [], [], "test state 0");
    const state1 = new SwitchState("state1", [], [], "test state 1");

    state0.returnStateRefs = [state1];

    const map = [state0];

    const rc = state0.resolveReturnStateIds(map);
    expect(rc).toBe(0);
});


test('resolve return state references', () => {
    const state0 = new SwitchState("state0", [0, 1], [], "test state 0");
    const state1 = new SwitchState("state1", [1, 0], [], "test state 1");

    const map = [state0, state1];

    const state0rc = state0.resolveReturnStateReferences(map);
    const state1rc = state1.resolveReturnStateReferences(map);


    expect(state0rc).toBe(-1);
    expect(state0.returnStateRefs).toStrictEqual([state0, state1]);
    expect(state1rc).toBe(-1);
    expect(state1.returnStateRefs).toStrictEqual([state1, state0]);
});

test('resolve return state references map incomplete', () => {
    const state0 = new SwitchState("state0", [0, 1], [], "test state 0");

    const map = [state0];

    const rc = state0.resolveReturnStateReferences(map);

    expect(rc).toBe(1);
});