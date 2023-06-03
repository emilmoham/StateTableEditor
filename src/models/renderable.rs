
use crate::models::state::StateRef;
use crate::models::section::Section;

#[derive(Debug)]
pub enum Renderable {
    State(StateRef),
    Section(Section)
}