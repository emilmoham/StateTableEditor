use std::string::ToString;
use regex::Regex;
use regex::Captures;

const MIN_STATES:u32 = 2;
const MAX_STATES:u32 = 20;

#[derive(Debug)]
pub struct State {
    pub id: u32,
    pub name: String,
    pub return_state_ids: Vec<u32>,
    pub description: String 
}

impl ToString for State {
    fn to_string(&self) -> String {
        let mut formatted_returns = String::from("");
        self.return_state_ids.iter().fold(&mut formatted_returns, |acc, return_state| {
            acc.push_str(&format!("{} ",return_state)); 
            acc 
        });
        
        format!("{}\n#$State ;{}; {};[{}] {}", self.id, &self.name, formatted_returns, self.id, &self.description)
    }
}

// impl fmt::Debug for State {
//     fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
//         write!(f, "State {{")?;
//         write!(f, "\n\tid: {:?}", self.id)?;
//         write!(f, "\n\tname: {:?}", &self.name)?;
//         write!(f, "\n\treturn_state_ids: {:?}", self.return_state_ids)?;
//         write!(f, "\n\tdescription: {:?}", &self.description)?;
//         write!(f, "\n}}")?;
//         Ok(())
//     }
// }

impl State {
    pub fn new() -> State {
        Self {
            id: 0,
            name: "".to_string(),
            return_state_ids: Vec::new(),
            description: "".to_string()
        }
    }

    pub fn read(input: &str) -> Result<State, String> {
        if let Some(caps) = Self::regex_parse(input) {
            let return_states: Vec<u32> = caps[2].split_ascii_whitespace().map(|x| x.parse::<u32>().unwrap()).collect();

            if return_states.len() < MIN_STATES.try_into().unwrap() || return_states.len() > MAX_STATES.try_into().unwrap() {
                return Err("Invalid number of return states".to_string());
            }

            let mut state = State::new();

            state.id = caps[3].parse().unwrap();
            state.name = caps[1].to_string();
            state.return_state_ids = return_states;
            state.description = caps[4].to_string();

            return Ok(state);
        } 
        
        Err("Parse Error".to_string())
    }

    fn regex_parse(input: &str) -> Option<Captures<'_>> {
        let re = Regex::new(r"#\$State ;(\w+)\s?;\s?(\S[ \d]+)\s?;\[(\d+)\]\s?(\S.+)").unwrap();
        return re.captures(input);
    }
}

#[cfg(test)]
mod tests {
    
    use crate::models::state::State;

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
        let state = State::regex_parse("#$State ;; 0 1 84 3 ;[2] This is an invalid state");
        assert!(state.is_none());
    }

    #[test]
    fn regex_parse_no_return_states() {
        let state = State::regex_parse("#$State ;StateName;;[2] This is an invalid state");
        assert!(state.is_none());
    }

    #[test]
    fn regex_parse_no_padding_around_return_states() {
        let state = State::regex_parse("#$State ;StateName;0 1 84 3;[2] This is a valid state");
        assert!(state.is_some());
    }

    #[test]
    fn regex_parse_too_much_padding_around_return_states() {
        let state = State::regex_parse("#$State ;StateName;  0 1 84 3  ;[2] This is an invalid state");
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

    #[test]
    fn parse_too_many_return_states() {
        let input = String::from("#$State ;Reject; 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 ;[13] Too many Return states");
        let state = State::read(&input);
        assert!(state.is_err());
    }

    #[test]
    fn format() {
        let state = State {
            id: 0,
            name: "test".to_string(),
            return_state_ids: vec![0, 1, 23, 425],
            description: "test state".to_string()
        };
        let expected_output = "0\n#$State ;test; 0 1 23 425 ;[0] test state".to_string();
        assert_eq!(state.to_string(), expected_output);
    }
}