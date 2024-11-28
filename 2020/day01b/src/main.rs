use std::fs;

fn main() {
    let entries = fs::read_to_string("input.txt").expect("Should read the file");

    let split_entries: Vec<i32> = entries.lines().map(|s| s.parse().unwrap()).collect();
    for i in 0..split_entries.len() - 2 {
        for j in i + 1..split_entries.len() - 1 {
            for k in j + 1..split_entries.len() {
                let num1 = split_entries.get(i).unwrap();
                let num2 = split_entries.get(j).unwrap();
                let num3 = split_entries.get(k).unwrap();
                if num1 + num2 + num3 == 2020 {
                    println!("Result: {}", num1 * num2 * num3);
                }
            }
        }
    }
}
