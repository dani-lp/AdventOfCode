use std::fs;

fn main() {
    let entries = fs::read_to_string("input.txt").unwrap();
    let tree_rows: Vec<&str> = entries.lines().collect();

    let tree_row_length = tree_rows.get(0).unwrap().len();

    let mut trees = 0;
    let mut current_x = 0;
    for i in 1..tree_rows.len() {
        current_x = (current_x + 3) % tree_row_length;

        if tree_rows.get(i).unwrap().chars().nth(current_x).unwrap() == '#' {
            trees += 1;
        }
    }

    println!("Result: {} trees", trees);
}
