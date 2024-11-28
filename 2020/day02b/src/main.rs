use std::fs;

fn main() {
    let entries = fs::read_to_string("input.txt").expect("Correct file reading");
    let passwords: Vec<&str> = entries.lines().collect();

    let mut valid_passwords = 0;
    for policy in passwords {
        let split_policy: Vec<&str> = policy.split(" ").collect();

        let mut policy_values = split_policy
            .get(0)
            .expect("Policy values should exist")
            .split("-");
        let pos1 = policy_values.next().unwrap().parse::<usize>().unwrap();
        let pos2 = policy_values.next().unwrap().parse::<usize>().unwrap();

        let mut split_policy_letter = split_policy
            .get(1)
            .expect("Policy letter should exist")
            .split(":");
        let policy_letter = split_policy_letter
            .next()
            .expect("Letter could not be obtained")
            .parse::<char>()
            .unwrap();

        let policy_password = split_policy.get(2).unwrap();

        let check1 = policy_password.chars().nth(pos1 - 1).unwrap() == policy_letter;
        let check2 = policy_password.chars().nth(pos2 - 1).unwrap() == policy_letter;

        if check1 ^ check2 {
            valid_passwords += 1;
        }
    }

    println!("Valid passwords: {}", valid_passwords);
}
