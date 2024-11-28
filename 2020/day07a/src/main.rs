use std::fs;
use std::str::Split;

struct Bag {
    name: String,
    content: Vec<String>,
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

        let content: Vec<String> = match is_empty {
            true => vec![],
            false => content_list_to_bags(content_list),
        };

        Bag {
            name,
            content,
        }
    }).collect();

    let total = bags
        .iter()
        .map(|bag| recursive_find_shiny_gold_bag(bag, &bags))
        .filter(|&b| b)
        .collect::<Vec<bool>>()
        .len();
    
    println!("Total: {}", total);
}

fn content_list_to_bags(content_list: Split<&str>) -> Vec<String> {
    let bag_list: Vec<String> = content_list.map(|bag| {
        let split_bag: Vec<&str> = bag.split(" ").collect();
        let formatted_bag = format!("{} {}", split_bag.get(1).unwrap(), split_bag.get(2).unwrap());
        formatted_bag
    }).collect();
    bag_list
}

fn recursive_find_shiny_gold_bag(bag: &Bag, bag_list: &Vec<Bag>) -> bool {
    if bag.content.len() == 0 {
        return false
    }
    if bag.content.iter().any(|b| b == "shiny gold") {
        return true
    }
    let any_valid_child = bag.content.iter().any(|b| {
        let new_bag = bag_list.iter().find(|s| &s.name == b).unwrap();
        let result = recursive_find_shiny_gold_bag(new_bag, bag_list);
        result
    });
    any_valid_child
}
