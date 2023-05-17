pub mod file_ops;
pub mod models;

use std::env;

use models::section::Section;
use models::state::State;

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() != 2 {
        todo!(); // Print Usage
    }

    // if let Ok(lines) = file_ops::io::read_file(&args[1]) {
    //     for line in lines {
    //         if let Ok(data) = line {
    //             println!("{}", data);
    //         }
    //     }
    // }

    let section = Section {
        description_lines: vec![String::from("one"), String::from("two")]
    };

    let state = State {
        id: 0,
        name: String::from("TrapState"),
        next_states: vec![0, 1, 1],
        description: String::from("Error State")
    };

    println!("{}", section.to_string());

    println!("{}", state.to_string());
}
