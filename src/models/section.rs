use std::string::ToString;

#[derive(Debug)]
pub struct Section {
    pub description_lines: Vec<String>
}

impl ToString for Section {
    fn to_string(&self) -> String {
        let mut formatted_section = String::from("****************************************\n");
        self.description_lines.iter().fold(&mut formatted_section, |acc, line| {
            acc.push_str(&format!("*  {}\n",&line));
            acc
        });
        formatted_section.push_str(&String::from("\n****************************************"));
        formatted_section
    }
}