pub mod models;

// use models::section::Section;
use models::state::State;
use models::app_table::AppTable;

fn main() {
    let table = AppTable::new(String::from("test.app"));
    table.load("sample.app");
}
