use std::string::ToString;
use regex::Regex;
use regex::Captures;

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

impl Section {
    pub fn new() -> Self {
        Self {
            description_lines: Vec::new()
        }
    }

    pub fn parse_description_line(&mut self, input: &str) {
        if let Some(captures) = Self::regex_parse(input) {
            self.description_lines.push(captures[1].to_string());
        }
    }

    fn regex_parse(input: &str) -> Option<Captures<'_>> {
        let re = Regex::new(r"\*\s{0,2}(.+)\r?\n?").unwrap();
        return re.captures(input);
    }
}

#[cfg(test)]
mod tests {

    use crate::models::section::Section;

    #[test]
    fn regex_parse_line_single_word() {
        let input = "*  stuff".to_string();
        assert!(Section::regex_parse(&input).is_some());
    }

    #[test]
    fn regex_parse_line_mutliple_words() {
        let input = "*  lots of stuff".to_string();
        assert!(Section::regex_parse(&input).is_some());
    }
    
    #[test]
    fn regex_parse_single_leading_space() {
        let input = "* lots of stuff".to_string();
        assert!(Section::regex_parse(&input).is_some());
    }

    #[test]
    fn regex_parse_no_leading_space() {
        let input = "*lots of stuff".to_string();
        assert!(Section::regex_parse(&input).is_some());
    }

    #[test]
    fn regex_parse_numbers_and_symbols() {
        let input = "*  do 3 (three) things".to_string();
        assert!(Section::regex_parse(&input).is_some());
    }

    #[test]
    fn regex_parse_blank_line() {
        assert!(Section::regex_parse("").is_none())
    }

    #[test]
    fn regex_parse_no_leading_asterisk() {
        assert!(Section::regex_parse("  this is not valid").is_none())
    }


    #[test]
    fn parse_section_single_line() {
        let input = vec!["*  this is line number 1".to_string()];
        let expected = vec!["this is line number 1".to_string()];
        let mut section = Section::new();
        section.parse_description_line(&input[0]);
        assert_eq!(section.description_lines, expected);
    }


    #[test]
    fn parse_section_multiple_lines() {
        let input = vec!["*  this is line number 1".to_string(), "*  this is line number 2".to_string()];
        let expected = vec!["this is line number 1".to_string(), "this is line number 2".to_string()];
        let mut section = Section::new();
        section.parse_description_line(&input[0]);
        section.parse_description_line(&input[1]);
        assert_eq!(section.description_lines, expected);
    }

    #[test]
    fn to_string_single_line_description() {
        let input = "this is line number 1".to_string();
        let section = Section {
            description_lines: vec![input.clone()]
        };
        let expected_output = format!("****************************************\n*  {}\n\n****************************************", &input);
        assert_eq!(section.to_string(), expected_output);

    }

    #[test]
    fn to_string_multiple_line_description() {
        let input = vec!["this is line number 1".to_string(), "this is line number 2".to_string()];
        let section = Section {
            description_lines: input.clone()
        };
        let expected_output = format!("****************************************\n*  {}\n*  {}\n\n****************************************", &input[0], &input[1]);
        assert_eq!(section.to_string(), expected_output);
    }
}