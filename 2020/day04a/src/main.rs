use std::fs;

fn main() {
    let entries = fs::read_to_string("input.txt").unwrap();
    let passports = entries.split("\n\n");

    let valid = passports
        .filter(|p| {
            ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"]
                .iter()
                .all(|f| p.contains(f))
        })
        .collect::<Vec<&str>>()
        .len();

    println!("Result: {}", valid);
}
