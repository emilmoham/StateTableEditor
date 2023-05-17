enum ParseStates {
    Header,
    Next,
    State,
    Section,
    Error
}

use crate::models::state::State;
use crate::models::section::Section;

#[derive(Debug)]
pub struct AppTable {
    filename: String,
    states: State,
    section: Section
}