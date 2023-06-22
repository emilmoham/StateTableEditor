
use crate::models::state::State;
use crate::models::section::Section;

#[derive(Debug)]
pub enum Renderable {
    State(State),
    Section(Section)
}