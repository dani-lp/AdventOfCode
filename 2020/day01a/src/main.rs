use std::collections::HashSet;
use std::fs;

fn main() {
    let entries = fs::read_to_string("input.txt").expect("Should read properly");
    let split_entries: Vec<i32> = entries.lines().map(|s| s.parse().unwrap()).collect();

    let mut seen: HashSet<i32> = HashSet::new();
    for entry in split_entries {
        let complement = 2020 - entry;
        if seen.contains(&complement) {
            println!("Result found: {}", complement * entry);
        }
        seen.insert(entry);
    }
}
