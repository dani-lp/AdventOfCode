use std::{fs, ops::Range};

struct Seat {
    row: usize,
    column: usize,
}

fn main() {
    let entries = fs::read_to_string("input.txt").unwrap();
    let passes = entries.lines();

    let result = passes
        .map(|p| position(p))
        .map(|p| score(p.row, p.column))
        .max()
        .unwrap();

    println!("Result: {}", result);
}

fn position(pass: &str) -> Seat {
    let row_raw = &pass[..7];
    let col_raw = &pass[7..];

    let row = minimize_range(0..127, row_raw);
    let column = minimize_range(0..7, col_raw);

    Seat { row, column }
}

fn minimize_range(initial_range: Range<usize>, row: &str) -> usize {
    let mut r = initial_range;
    for c in row.chars() {
        let range_size = r.len();
        let half_size = range_size / 2;
        if c == 'F' || c == 'L' {
            r = r.start..(r.start + half_size);
        } else if c == 'B' || c == 'R' {
            r = (r.start + half_size)..r.end;
        }
    }
    r.start + 1
}

fn score(row: usize, column: usize) -> usize {
    row * 8 + column
}
