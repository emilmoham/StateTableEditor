use std::string::ToString;

#[derive(Debug)]
pub struct State {
    pub id: u16,
    pub name: String,
    pub next_states: Vec<i32>,
    pub description: String 
}

impl ToString for State {
    fn to_string(&self) -> String {
        let mut formatted_returns = String::from("");
        self.next_states.iter().fold(&mut formatted_returns, |acc, return_state| {
            acc.push_str(&format!("{} ",return_state)); 
            acc 
        });
        
        format!("{}\n#$State ;{}; {};[{}] {}", self.id, &self.name, &formatted_returns, self.id, &self.description)
    }
}