const SwitchState = require("../src/models/SwitchState");

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

test('set return state add first return state', () => {
    const state0 = new SwitchState("state0", [], [], "test state 0");
    const rc = state0.setReturnState(0, state0);
    expect(rc).toBe(true);
    expect(state0.returnStateRefs.length).toBe(1);
    expect(state0.returnStateRefs[0]).toBe(state0);
});

test('set return state add return state out of order ', () => {
    const state0 = new SwitchState("state0", [], [], "test state 0");
    const rc = state0.setReturnState(1, state0);
    expect(rc).toBe(false);
    expect(state0.returnStateRefs.length).toBe(0);
});

test('set return state add too many return states', () => {
    const state0 = new SwitchState("state0", [], [], "test state 0");
    const max_states = SwitchState.MAX_STATES;
    for(let i = 0; i < max_states; i++) {
        const rc = state0.setReturnState(i, state0);
        expect(rc).toBe(true);
    }

    expect(state0.returnStateRefs.length).toBe(max_states);
    const rc = state0.setReturnState(max_states, state0);
    expect(rc).toBe(false);
});

test('set return state add state already at index', () => {
    const state0 = new SwitchState("state0", [], [], "test state 0");
    let rc = state0.setReturnState(0, state0);
    expect(rc).toBe(true)
    expect(state0.returnStateRefs.length).toBe(1);
    rc = state0.setReturnState(0, state0);
    expect(rc).toBe(true);
});

test('add caller first reference', () => {
    const state0 = new SwitchState("state0", [], [], "test state 0");
    const state1 = new SwitchState("state1", [], [], "test state 1");

    state0.addCaller(state1);
    expect(state0.callers.get(state1)).toBe(1);
});

test('add caller reference 2+', () => {
    const state0 = new SwitchState("state0", [], [], "test state 0");
    const state1 = new SwitchState("state1", [], [], "test state 1");

    state0.addCaller(state1);
    state0.addCaller(state1);
    state0.addCaller(state1);
    expect(state0.callers.get(state1)).toBe(3);
});


test('remove caller only reference', () => {
    const state0 = new SwitchState("state0", [], [], "test state 0");
    const state1 = new SwitchState("state1", [], [], "test state 1");

    state0.addCaller(state1);
    expect(state0.callers.get(state1)).toBe(1);

    state0.removeCaller(state1);
    expect(state0.callers.get(state1)).toBe(undefined);
});

test('remove caller multiple references', () => {
    const state0 = new SwitchState("state0", [], [], "test state 0");
    const state1 = new SwitchState("state1", [], [], "test state 1");

    state0.addCaller(state1);
    state0.addCaller(state1);
    expect(state0.callers.get(state1)).toBe(2);

    state0.removeCaller(state1);
    expect(state0.callers.get(state1)).toBe(1);
});

test('remove caller invalid reference', () => {
    const state0 = new SwitchState("state0", [], [], "test state 0");
    const state1 = new SwitchState("state1", [], [], "test state 1");

    state0.removeCaller(state1);
    expect(state0.callers.get(state1)).toBe(undefined);
})