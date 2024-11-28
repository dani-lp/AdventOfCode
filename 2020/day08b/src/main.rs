use std::fs;
use std::collections::HashSet;

fn main() {
    let entries = fs::read_to_string("input.txt").unwrap();
    let instructions: Vec<&str> = entries.lines().collect();

    for i in 0..instructions.len() {
        let (valid_change_nop, accumulator_nop) = is_valid_change(i as isize, "nop", &instructions);
        if valid_change_nop {
            println!("Result: {}", accumulator_nop);
            break;
        }
        let (valid_change_jmp, accumulator_jmp) = is_valid_change(i as isize, "jmp", &instructions);
        if valid_change_jmp{
            println!("Result: {}", accumulator_jmp);
            break;
        }
    }
}

fn is_valid_change(index_to_check: isize, new_instruction: &str, instructions: &Vec<&str>) -> (bool, isize) {
    let mut executed_instructions: HashSet<isize> = HashSet::new();
    let mut accumulator = 0;
    let mut pc: isize = 0;

    let mut current_instruction: &&str;
    while !executed_instructions.contains(&pc) && pc < instructions.len() as isize {
        executed_instructions.insert(pc);
        current_instruction = instructions.get(pc as usize).unwrap();

        let mut split_instruction = current_instruction.split(" ");
        let mut code = split_instruction.next().unwrap();
        let value = split_instruction.next().unwrap().parse::<isize>().unwrap();

        if pc == index_to_check && code != "acc" {
            code = new_instruction;
        }

        if code == "acc" {
            accumulator += value;
            pc += 1;
        } else if code == "jmp" {
            pc += value;
        } else if code == "nop" {
            pc += 1;
        }
    }

    if executed_instructions.contains(&pc) {
        return (false, 0)
    } else if pc >= instructions.len() as isize {
        return (true, accumulator)
    }
    (false, 0)
}
