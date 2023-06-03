use std::string::ToString;
use std::cell::RefCell;
use std::rc::Rc;
use std::fmt;
use regex::Regex;
use regex::Captures;

const MIN_STATES:u32 = 2;
const MAX_STATES:u32 = 20;

struct State {
    pub id: u32,
    pub name: String,
    pub return_state_ids: Vec<u32>,
    //pub return_state_refs: Vec<StateRef>,
    //pub callers: HashMap<StateRef, u32>,
    pub description: String 
}

#[derive(Debug, Clone)]
pub struct StateRef(Rc<RefCell<State>>);

impl StateRef {
    fn borrow(&self) -> std::cell::Ref<'_, State> {
        self.0.borrow()
    }

    fn borrow_mut(&self) -> std::cell::RefMut<'_, State> {
        self.0.borrow_mut()
    }
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

impl fmt::Debug for State {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "State {{")?;
        write!(f, "\n\tid: {:?}", self.id)?;
        write!(f, "\n\tname: {:?}", &self.name)?;
        write!(f, "\n\treturn_state_ids: {:?}", self.return_state_ids)?;
        write!(f, "\n\treturn_state_refs: TODO")?;
        write!(f, "\n\tcallers: TODO")?;
        write!(f, "\n\tdescription: {:?}", &self.description)?;
        write!(f, "\n}}")?;
        Ok(())
    }
}

impl State {
    pub fn new() -> StateRef {
        StateRef(Rc::new(RefCell::new(Self {
            id: 0,
            name: "".to_string(),
            return_state_ids: Vec::new(),
            //return_state_refs: Vec::new(),
            //callers: HashMap::new(),
            description: "".to_string()
        })))
    }

    pub fn read(input: &str) -> Result<StateRef, String> {
        if let Some(caps) = Self::regex_parse(input) {
            let return_states: Vec<u32> = caps[2].split_ascii_whitespace().map(|x| x.parse::<u32>().unwrap()).collect();

            if return_states.len() < MIN_STATES.try_into().unwrap() || return_states.len() > MAX_STATES.try_into().unwrap() {
                return Err("Invalid number of return states".to_string());
            }

            let state = State::new();

            state.borrow_mut().id = caps[3].parse().unwrap();
            state.borrow_mut().name = caps[1].to_string();
            state.borrow_mut().return_state_ids = return_states;
            //state.borrow_mut().return_state_refs = Vec::new();
            //state.borrow_mut().callers = HashMap::new();
            state.borrow_mut().description = caps[4].to_string();

            return Ok(state);
        } 
        
        Err("Parse Error".to_string())
    }

    fn regex_parse(input: &str) -> Option<Captures<'_>> {
        let re = Regex::new(r"#\$State ;(\w+)\s?;\s?(\S[ \d]+)\s?;\[(\d+)\]\s?(\S.+)").unwrap();
        return re.captures(input);
    }

    pub fn resolve_return_state_ids(&mut self, _state_map: &Vec<Rc<State>>) -> Result<u32, u32> {
        todo!();
    }

    pub fn resolve_return_state_refs(&mut self, _state_map: &Vec<State>) -> Result<State, String> {
        todo!();
    }

    pub fn set_return_state(&mut self, _index: u32, _state: State) -> Result<bool, String> {
        todo!();
    }

    pub fn add_caller(&mut self, _state: State) {
        todo!();
    }

    pub fn remove_caller(&mut self, _state: State) {
        todo!();
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

        assert_eq!(state.borrow().id, 2);
        assert_eq!(state.borrow().name, "StateName".to_string());
        assert_eq!(state.borrow().return_state_ids, vec!(0, 1, 84, 3));
        assert_eq!(state.borrow().description, "State Description".to_string());
    }

    #[test]
    fn parse_mutli_digit_id() {
        let input = String::from("#$State ;StateName; 0 1 84 310 ;[244] State Description");
        let output = State::read(&input);
        
        assert!(output.is_ok());

        let state = output.unwrap();

        assert_eq!(state.borrow().id, 244);
        assert_eq!(state.borrow().name, "StateName".to_string());
        assert_eq!(state.borrow().return_state_ids, vec!(0, 1, 84, 310));
        assert_eq!(state.borrow().description, "State Description".to_string());
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
            //return_state_refs: Vec::new(),
            //callers: HashMap::new(),
            description: "test state".to_string()
        };
        let expected_output = "0\n#$State ;test; 0 1 23 425 ;[0] test state".to_string();
        assert_eq!(state.to_string(), expected_output);
    }

    // #[test]
    // fn resolve_return_state_id_all_defined() {
    //     let mut state0 = Rc::new(State { 
    //         id: 10,
    //         name: "state0".to_string(),
    //         return_state_ids: Vec::new(),
    //         return_state_refs: Vec::new(),
    //         //callers: HashMap::new(),
    //         description: "test state 0".to_string()
    //     });

    //     let mut state1 = Rc::new(State { 
    //         id: 10,
    //         name: "state1".to_string(),
    //         return_state_ids: Vec::new(),
    //         return_state_refs: Vec::new(),
    //         //callers: HashMap::new(),
    //         description: "test state 1".to_string()
    //     });

    //     let map: Vec<Rc<State>> = vec![Rc::clone(&state0),Rc::clone(&state1)];

    //     if let Some(mutable_state_0) = Rc::<State>::get_mut(&mut state0) {
    //         assert!(mutable_state_0.resolve_return_state_ids(&map).is_ok());
    //         assert_eq!(mutable_state_0.return_state_ids, vec![0, 1]);
    //     } else {
    //         panic!("mutable state was None");
    //     }

    //     if let Some(mutable_state_1) = Rc::<State>::get_mut(&mut state1) {
    //         assert!(mutable_state_1.resolve_return_state_ids(&map).is_ok());
    //         assert_eq!(mutable_state_1.return_state_ids, vec![1, 0]);
    //     } else {
    //         panic!();
    //     }
    // }

    // #[test]
    // fn resolve_return_state_ids_incomplete_map() {
    //     let state1 = State { 
    //         id: 10,
    //         name: "state1".to_string(),
    //         return_state_ids: Vec::new(),
    //         return_state_refs: Vec::new(),
    //         callers: HashMap::new(),
    //         description: "test state 1".to_string()
    //     };

    //     let mut state0 = State { 
    //         id: 10,
    //         name: "state0".to_string(),
    //         return_state_ids: Vec::new(),
    //         return_state_refs: vec![state1],
    //         callers: HashMap::new(),
    //         description: "test state 0".to_string()
    //     };

    //     let map: Vec<&mut State> = vec![&mut state0];

    //     let result = state0.resolve_return_state_ids(&map);
    //     assert!(result.is_err());
    //     assert_eq!(result.unwrap(), 0);
    // }

    #[test]
    fn resolve_return_state_refs_all_defined() {
        assert!(true);
    }

    #[test]
    fn resolve_return_state_refs_incomplete_map() {
        assert!(true);
    }

    #[test]
    fn set_return_state_first_return_state() {
        assert!(true);
    }

    #[test]
    fn set_return_state_add_return_state_out_of_order() {
        assert!(true);
    }

    #[test]
    fn set_return_state_add_too_many_return_states() {
        assert!(true);
    }

    
    #[test]
    fn set_return_state_add_state_already_at_index() {
        assert!(true);
    }

    #[test]
    fn add_caller_first_reference() {
        assert!(true);
    }

    #[test]
    fn add_caller_reference_2_or_more() {
        assert!(true);
    }

    #[test]
    fn remove_caller_only_reference() {
        assert!(true);
    }

    #[test]
    fn remove_caller_multiple_references() {
        assert!(true);
    }

    #[test]
    fn remove_caller_invalid_reference() {
        assert!(true);
    }
}