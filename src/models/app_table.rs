enum ParseStates {
    Header,
    Next,
    State,
    Section,
    Error
}

use std::fs::File;
use std::io::{ self, BufRead };

use crate::models::renderable::Renderable;
use crate::models::state::State;


#[derive(Debug)]
pub struct AppTable {
    filename: String,
    renderables: Vec<Renderable>,
    states: Vec<State>
}

impl AppTable {
    pub fn new(filename: String) -> Self {
        Self {
            filename: filename,
            renderables: Vec::new(),
            states: Vec::new()
        }
    }

    pub fn load(self, filename: &str) {
        if let Ok(lines) = Self::read_file(filename) {
            for line in lines {
                if let Ok(data) = line {
                    println!("{}", data);
                }
            }
        }
    }

    fn read_file(filename: &str) -> io::Result<io::Lines<io::BufReader<File>>> {
        let file = File::open(filename)?;
        Ok(io::BufReader::new(file).lines())
    }
}