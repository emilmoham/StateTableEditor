pub mod models;

use models::app_table::AppTable;

fn main() {
    let table = AppTable::new(String::from("test.app"));
    table.load("sample.app");
}
