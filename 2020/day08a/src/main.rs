use std::fs;
use std::collections::HashSet;

fn main() {
    let entries = fs::read_to_string("input.txt").unwrap();
    let instructions: Vec<&str> = entries.lines().collect();

    let mut executed_instructions: HashSet<isize> = HashSet::new();
    let mut accumulator = 0;
    let mut pc: isize = 0;

    let mut current_instruction: &&str;
    while !executed_instructions.contains(&pc) {
        executed_instructions.insert(pc);
        current_instruction = instructions.get(pc as usize).unwrap();

        let mut split_instruction = current_instruction.split(" ");
        let code = split_instruction.next().unwrap();
        let value = split_instruction.next().unwrap().parse::<isize>().unwrap();

        if code == "acc" {
            accumulator += value;
            pc += 1;
        } else if code == "jmp" {
            pc += value;
        } else if code == "nop" {
            pc += 1;
        }
    }

    println!("Result: {}", accumulator);
}
