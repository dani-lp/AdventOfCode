use std::collections::BTreeMap;
use std::{fs, ops::Range};

struct Seat {
    row: usize,
    column: usize,
}

fn main() {
    let entries = fs::read_to_string("input.txt").unwrap();
    let passes = entries.lines();

    let seats = passes.map(|p| position(p));

    let mut seats_by_row: BTreeMap<usize, Vec<usize>> = BTreeMap::new();

    for seat in seats {
        if seats_by_row.contains_key(&seat.row) {
            let cols = seats_by_row.get_mut(&seat.row).unwrap();
            cols.push(seat.column);
        } else {
            let col_seats = vec![seat.column];
            seats_by_row.insert(seat.row, col_seats);
        }
    }

    let min: usize = *seats_by_row.keys().min().unwrap();
    let max: usize = *seats_by_row.keys().max().unwrap();

    for seat in seats_by_row {
        if seat.1.len() < 8 && seat.0 != min && seat.0 != max {
            for i in 1..7 {
                if !seat.1.contains(&i) {
                    println!("Score: {}", score(seat.0, i));
                }
            }
        }
    }

    // println!("Result: {}", result);
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
