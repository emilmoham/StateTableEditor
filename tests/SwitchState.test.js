const SwitchState = require("../models/SwitchState");

test('parse state single digit id ', () => {
    const state = SwitchState.parseState("#$State ;GetAppTrunk; 0 3 3 3 3 3 ;[2] Get Trunk Port");
    expect(state.id).toBe(2);
    expect(state.name).toBe("GetAppTrunk");
    expect(state.returnStates).toBe([ '0', '3', '3', '3', '3', '3' ]);
    expect(state.description).toBe("Get Trunk Port");
});

test('parse state double digit id', () =>{
    const state = SwitchState.parseState("#$State ;RejectCall; 0 87 87 ;[13] Reject Unknown Inbound Call <6>");
    expect(state.id).toBe(13);
    expect(state.name).toBe("RejectCall");
    expect(state.returnStates).toBe([ '0', '87', '87']);
    expect(state.description).toBe("Reject Unknown Inbound Call <6>");
});