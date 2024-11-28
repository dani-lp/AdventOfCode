use std::fs;

fn main() {
    let entries = fs::read_to_string("input.txt").unwrap();
    let tree_rows: Vec<&str> = entries.lines().collect();

    let score1 = get_slope_score(1, 1, &tree_rows);
    let score2 = get_slope_score(3, 1, &tree_rows);
    let score3 = get_slope_score(5, 1, &tree_rows);
    let score4 = get_slope_score(7, 1, &tree_rows);
    let score5 = get_slope_score(1, 2, &tree_rows);

    let score = score1 * score2 * score3 * score4 * score5;
    assert_eq!(5140884672, score, "Should be 5140884672");
}

fn get_slope_score(right_amount: usize, down_amount: usize, tree_rows: &Vec<&str>) -> usize {
    let mut trees = 0;
    let mut current_x = 0;

    let tree_row_length = tree_rows.get(0).unwrap().len();

    for i in down_amount..tree_rows.len() {
        if down_amount > 1 && i % down_amount != 0 {
            continue;
        }

        current_x = (current_x + right_amount) % tree_row_length;

        if tree_rows.get(i).unwrap().chars().nth(current_x).unwrap() == '#' {
            trees += 1;
        }
    }

    trees
}
