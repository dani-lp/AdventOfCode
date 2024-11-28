use std::collections::HashSet;
use std::fs;

fn main() {
    let entries = fs::read_to_string("input.txt").unwrap();
    let groups = entries.split("\n\n");

    let total: usize = groups
        .map(|group| -> usize { HashSet::<char>::from_iter(group.replace("\n", "").chars()).len() })
        .sum();
    println!("Total: {}", total);
}
