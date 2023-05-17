use std::fs::File;
use std::io::{ self, BufRead };

pub fn read_file(filename: &str) -> io::Result<io::Lines<io::BufReader<File>>> {
    let file = File::open(filename)?;
    Ok(io::BufReader::new(file).lines())
}