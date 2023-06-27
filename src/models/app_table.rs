enum ParseState {
    Header,
    Next,
    State,
    Section,
    Error
}

use std::fs::File;
use std::io::{ self, BufRead };
use regex::Regex;
use regex::Captures;

//use crate::models::renderable::Renderable;
use crate::models::state::State;


#[derive(Debug)]
pub struct AppTable {
    filename: String,
    //renderables: Vec<Renderable>,
    states: Vec<State>
}

impl AppTable {
    pub fn new(filename: String) -> Self {
        Self {
            filename: filename,
            //renderables: Vec::new(),
            states: Vec::new()
        }
    }

    pub fn load(self, filename: &str) -> Result<bool,String> {
        if let Ok(lines) = Self::read_file(filename) {
            let mut line_count = 0;
            let mut read_state = ParseState::Header; 
            
            for line in lines {
                if let Ok(data) = line {
                    match read_state {
                        ParseState::Header => read_state = Self::read_header(&data),
                        ParseState::Next => read_state = Self::read_next(&data),
                        ParseState::State => read_state = Self::read_state(&data),
                        ParseState::Section => read_state = Self::read_section(&data),
                        ParseState::Error => return Err(format!("Parse Error at line {}", &line_count)),
                    }

                    println!("{}", data);
                    line_count += 1;
                }
            }

            return Ok(true);
        }
        return Err("No lines dude".to_string());
    }

    fn read_file(filename: &str) -> io::Result<io::Lines<io::BufReader<File>>> {
        let file = File::open(filename)?;
        Ok(io::BufReader::new(file).lines())
    }

    fn read_header(line: &str) -> ParseState {
        match line {
            "#$HEADER; NULL" => return ParseState::Next,
            _ => return ParseState::Error
        }
    }

    fn read_next(line: &str) -> ParseState {
        if line.len() == 0 {
            return ParseState::Next;
        }

        if line.chars().nth(0) == Some('*') {
            return ParseState::Section;
        }

        if line.trim().parse::<u32>().is_ok() {
            return ParseState::State;
        }

        return ParseState::Error;
    }

    fn read_state(_line: &str) -> ParseState {
        return ParseState::Next;
    }

    fn read_section(line: &str) -> ParseState {
        let re = Regex::new(r"#\$State ;(\w+)\s?;\s?(\S[ \d]+)\s?;\[(\d+)\]\s?(\S.+)").unwrap();

        if line.len() == 0 {
            return ParseState::Section;
        }

        let re = Regex::new(r"\*{1,}(\s{2,})?").unwrap();
        if let Some(caps) = re.captures(line) {
            if caps.len() <= 1 {
                return ParseState::Error;
            }
        }

        let re2 = Regex::new(r"\*{3,}").unwrap();
        if let Some(caps) = re2.captures(line) {
            return ParseState::Next;
        }

        return ParseState::Section;
    }
}