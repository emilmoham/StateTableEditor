use std::string::ToString;
use std::collections::HashMap;
use regex::Regex;
use regex::Captures;

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

    pub fn read(input: &str) -> Result<State, String> {
        let caps = Self::regex_parse(input).unwrap();

        let state = State {
            id: caps[3].parse().unwrap(),
            name: caps[1].to_string(),
            return_state_ids: caps[2].split_ascii_whitespace().map(|x| x.parse::<u16>().unwrap()).collect(),
            return_state_refs: Vec::new(),
            callers: HashMap::new(),
            description: caps[4].to_string()
        };

        return Ok(state);
    }

    fn regex_parse(input: &str) -> Option<Captures<'_>> {
        let re = Regex::new(r"#\$State ;(\w+)\s?;\s?(\S[ \d]+)\s?;\[(\d+)\]\s?(\S.+)").unwrap();
        return re.captures(input);
    }
}

#[cfg(test)]
mod tests {
    
    use crate::State;

    #[test]
    fn parse_valid_state() {
        let state = State::regex_parse("#$State ;StateName; 0 1 84 3 ;[2] This is a valid state");
        assert!(state.is_some());
    }

    #[test]
    fn regex_parse_no_input() {
        let state = State::regex_parse("");
        assert!(state.is_none());
    }

    #[test]
    fn regex_parse_no_state_name() {
        let state = State::regex_parse("#$State ;; 0 1 84 3 ;[2] This is a valid state");
        assert!(state.is_none());
    }

    #[test]
    fn regex_parse_no_return_states() {
        let state = State::regex_parse("#$State ;StateName;;[2] This is a valid state");
        assert!(state.is_none());
    }

    #[test]
    fn regex_parse_no_padding_around_return_states() {
        let state = State::regex_parse("#$State ;StateName;0 1 84 3;[2] This is a valid state");
        assert!(state.is_some());
    }

    #[test]
    fn regex_parse_too_much_padding_around_return_states() {
        let state = State::regex_parse("#$State ;StateName;  0 1 84 3  ;[2] This is a valid state");
        assert!(state.is_none());
    }

    #[test]
    fn regex_parse_no_description() {
        let state = State::regex_parse("#$State ;StateName; 0 1 84 3 ;[2]  ");
        assert!(state.is_none());
    }

    #[test]
    fn regex_parse_description_no_leading_space() {
        let state = State::regex_parse("#$State ;StateName;0 1 84 3;[2]This is a state description");
        assert!(state.is_some());
    }



    #[test]
    fn parse_single_digit_id() {
        let input = String::from("#$State ;StateName; 0 1 84 3 ;[2] State Description");
        let output = State::read(&input);
        
        assert!(output.is_ok());

        let state = output.unwrap();

        assert_eq!(state.id, 2);
        assert_eq!(state.name, "StateName".to_string());
        assert_eq!(state.return_state_ids, vec!(0, 1, 84, 3));
        assert_eq!(state.description, "State Description".to_string());
    }

    #[test]
    fn parse_mutli_digit_id() {
        let input = String::from("#$State ;StateName; 0 1 84 310 ;[244] State Description");
        let output = State::read(&input);
        
        assert!(output.is_ok());

        let state = output.unwrap();

        assert_eq!(state.id, 244);
        assert_eq!(state.name, "StateName".to_string());
        assert_eq!(state.return_state_ids, vec!(0, 1, 84, 310));
        assert_eq!(state.description, "State Description".to_string());
    }
}