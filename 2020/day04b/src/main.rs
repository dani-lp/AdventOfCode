use regex::Regex;
use std::fs;

fn main() {
    let entries = fs::read_to_string("input.txt").unwrap();
    let passports = entries.split("\n\n");

    let valid_passport_count = passports
        .filter(|p| {
            ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"]
                .iter()
                .all(|f| p.contains(f))
        })
        .filter(|p| validate_passport(p))
        .collect::<Vec<&str>>()
        .len();

    println!("Results: {}", valid_passport_count);
}

fn validate_passport(passport: &str) -> bool {
    let passport_without_newline = passport.replace("\n", " ");
    let split_passport = passport_without_newline.split(" ");

    let mut valid = true;
    for field in split_passport {
        let mut split_field = field.split(":");

        let field_key = split_field.next().unwrap();
        // let field_value = split_field.next().unwrap();
        let field_value = match split_field.next() {
            Some(a) => a,
            None => {
                println!("Error!");
                ""
            }
        };
        valid = valid
            && match field_key {
                "byr" => validate_byr(field_value),
                "iyr" => validate_iyr(field_value),
                "eyr" => validate_eyr(field_value),
                "hgt" => validate_hgt(field_value),
                "hcl" => validate_hcl(field_value),
                "ecl" => validate_ecl(field_value),
                "pid" => validate_pid(field_value),
                "cid" => true,
                _ => false,
            }
    }

    valid
}

fn validate_byr(byr: &str) -> bool {
    let numeric_byr = byr.parse::<usize>().unwrap();
    numeric_byr >= 1920 && numeric_byr <= 2002
}

fn validate_iyr(iyr: &str) -> bool {
    let numeric_iyr = iyr.parse::<usize>().unwrap();
    numeric_iyr >= 2010 && numeric_iyr <= 2020
}

fn validate_eyr(eyr: &str) -> bool {
    let numeric_eyr = eyr.parse::<usize>().unwrap();
    numeric_eyr >= 2020 && numeric_eyr <= 2030
}

fn validate_hgt(hgt: &str) -> bool {
    let re = Regex::new(r"^(1([5-8][0-9]|9[0-3])cm|(59|6[0-9]|7[0-6])in)$").unwrap();
    re.is_match(hgt)
}

fn validate_hcl(hcl: &str) -> bool {
    let re = Regex::new(r"^#[0-9a-fA-F]{6}$").unwrap();
    re.is_match(hcl)
}

fn validate_ecl(ecl: &str) -> bool {
    let re = Regex::new(r"^(amb|blu|brn|gry|grn|hzl|oth)$").unwrap();
    re.is_match(ecl)
}

fn validate_pid(pid: &str) -> bool {
    let re = Regex::new(r"^0*[0-9]{9}$").unwrap();
    re.is_match(pid)
}
