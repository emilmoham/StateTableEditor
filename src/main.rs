pub mod models;

use std::env;

use models::section::Section;
use models::state::State;
use models::app_table::AppTable;

fn main() {
    let args: Vec<String> = env::args().collect();

    // let section = Section {
    //     description_lines: vec![String::from("one"), String::from("two")]
    // };

    // let state = State {
    //     id: 0,
    //     name: String::from("TrapState"),
    //     next_states: vec![0, 1, 1],
    //     description: String::from("Error State")
    // };

    // println!("{}", section.to_string());

    // println!("{}", state.to_string());

    let mut table = AppTable::new(String::from("test.app"));
    table.load("sample.app");
}
