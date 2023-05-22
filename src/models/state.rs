use std::string::ToString;
use std::collections::HashMap;
use regex::Regex;

#[derive(Debug)]
pub struct State {
    pub id: u16,
    pub name: String,
    pub return_state_ids: Vec<u16>,
    pub return_state_refs: Vec<State>,
    pub callers: HashMap<State, u16>,
    pub description: String 
}

impl ToString for State {
    fn to_string(&self) -> String {
        let mut formatted_returns = String::from("");
        self.return_state_ids.iter().fold(&mut formatted_returns, |acc, return_state| {
            acc.push_str(&format!("{} ",return_state)); 
            acc 
        });
        
        format!("{}\n#$State ;{}; {};[{}] {}", self.id, &self.name, "test".to_string(), self.id, &self.description)
    }
}

impl State {
    pub fn new() -> Self {
        Self {
            id: 0,
            name: "".to_string(),
            return_state_ids: Vec::new(),
            return_state_refs: Vec::new(),
            callers: HashMap::new(),
            description: "".to_string()
        }
    }

    pub fn parse(input: &str) -> Result<State, String> {
        let re = Regex::new(r"#\$State ;(\w{0,})[ ]?;([ \d]{0,});\[(\d+)\] (.{0,})").unwrap();
        if !re.is_match(input) {
            return Err("Parse Error".to_string());
        }

        let caps: Vec<&str> = re.captures(input).expect("Uh oh").get(1).iter().map(|x| x.as_str()).collect();

        if caps.len() < 4 {
            return Err(format!("Incorrect number of matches: {}", caps.len()));
        }

        let state = State {
            id: caps[2].parse().unwrap(),
            name: caps[0].to_string(),
            return_state_ids: caps[1].split(' ').map(|x| x.parse::<u16>().unwrap()).collect(),
            return_state_refs: Vec::new(),
            callers: HashMap::new(),
            description: caps[3].to_string()
        };

        return Ok(state);
    }
}

#[cfg(test)]
mod tests {
    
    use crate::State;

    #[test]
    fn parse_single_digit_id() {
        let input = String::from("#$State ;StateName; 0 1 84 3 ;[2] State Description");
        let output = State::parse(&input);
        
        //assert!(output.is_ok());

        let state = output.unwrap();

        assert_eq!(state.id, 0);
        assert_eq!(state.name, "StateName".to_string());
        assert_eq!(state.return_state_ids, vec!(0, 1, 84, 3));
    }
}