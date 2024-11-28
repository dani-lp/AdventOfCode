use std::fs;
use std::str::Split;

struct ContentBag {
    name: String,
    amount: usize,
}

struct Bag {
    name: String,
    content: Vec<ContentBag>,
}

fn main() {
    let entries = fs::read_to_string("input.txt").unwrap();
    let rules = entries.lines();

    let bags: Vec<Bag> = rules.map(|rule| {
        let name_and_content: Vec<&str> = rule.split(" bags contain ").collect();
        let name = name_and_content.get(0).unwrap().to_string();
        let content = name_and_content.get(1).unwrap().replace(".", "");
        let content_list = content.split(", ");

        let is_empty = content_list.clone().any(|c| c == "no other bags");

        let content: Vec<ContentBag> = match is_empty {
            true => vec![],
            false => content_list_to_bags(content_list),
        };

        Bag {
            name,
            content,
        }
    }).collect();

    let shiny_gold_bag = bags.iter().find(|bag| bag.name == "shiny gold").unwrap();
    let total = recursive_count_bags(shiny_gold_bag, &bags);

    println!("Total: {}", total);
}

fn content_list_to_bags(content_list: Split<&str>) -> Vec<ContentBag> {
    let bag_list: Vec<ContentBag> = content_list.map(|bag| {
        let split_bag: Vec<&str> = bag.split(" ").collect();
        let formatted_bag = format!("{} {}", split_bag.get(1).unwrap(), split_bag.get(2).unwrap());
        ContentBag {
            name: formatted_bag,
            amount: split_bag.get(0).unwrap().parse::<usize>().unwrap(),
        }
    }).collect();
    bag_list
}

fn recursive_count_bags(bag: &Bag, bag_list: &Vec<Bag>) -> usize {
    if bag.content.len() == 0 {
        return 0
    }
    let total: Vec<usize> = bag.content.iter().map(|b| {
        let found_bag = bag_list.iter().find(|a| a.name == b.name).unwrap();
        b.amount + b.amount * recursive_count_bags(found_bag, bag_list)
    }).collect();

    let count = total.iter().sum();

    count
}
