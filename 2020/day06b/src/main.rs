use std::fs;

fn main() {
    let entries = fs::read_to_string("input.txt").unwrap();
    let groups = entries.split("\n\n");

    for g in groups.clone() {
        println!("{}\n--", g);
    }

    let mut total = 0;
    for group in groups {
        let answers = group.split("\n");
        for a in answers.clone() {
            println!("{}", a);
        }

        let answer_vec = group.split("\n").collect::<Vec<&str>>();
        let first_answer = answer_vec.get(0).unwrap();

        let mut count = 0;
        for question in first_answer.chars() {
            if answers.clone().all(|answer| answer.contains(question)) {
                count += 1;
            }
        }

        total += count;
        println!("- Count: {} -\n", count);
    }

    println!("Total: {}", total);
}
