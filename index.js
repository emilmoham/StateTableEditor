import { SwitchState } from './models/SwitchState.js';
//import { Section } from './models/Section.js';
import { AppTable } from './models/AppTable.js';

function TestReadAppTable(){
    const table = new AppTable("sample.app");
    table.read();
    table.show();
}

function TestSwitchState() {
    const state0 = new SwitchState(0, "TrapState", [], "In the never ending trap state");
    const state1 = new SwitchState(1, "PortOpening", [], "Opening Port");
    state0.SetReturnState(2, state1, state0);
    state0.SetReturnState(1, state1, state0);
}

function Main(){
    //TestSwitchState();
    TestReadAppTable();
}

Main();