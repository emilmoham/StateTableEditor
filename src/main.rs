pub mod models;

use models::app_table::AppTable;
// use models::state::State;

fn main() {
    let table = AppTable::new(String::from("test.app"));
    let x = table.load("sample.app");

    match x {
        Ok(_) => println!("Done!"),
        Err(x) => println!("{}", x)
    }

    // let state = State {
    //     id: 10,
    //     name: "Test".to_string(),
    //     return_state_ids: vec![0, 1, 20, 130],
    //     description: "Test Description".to_string()
    // };

    // println!("{}", state.to_string());

    // println!("{:#?}", state);
}
