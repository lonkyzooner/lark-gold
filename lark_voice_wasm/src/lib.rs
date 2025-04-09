use wasm_bindgen::prelude::*;
use wee_alloc::WeeAlloc;

#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

#[wasm_bindgen]
pub fn process_audio(input: &[f32]) -> Vec<f32> {
    // Placeholder: apply simple gain reduction
    input.iter().map(|x| x * 0.5).collect()
}

#[wasm_bindgen]
pub fn analyze_audio(input: &[f32]) -> f32 {
    // Placeholder: compute average absolute amplitude
    input.iter().map(|x| x.abs()).sum::<f32>() / input.len() as f32
}

#[wasm_bindgen]
pub fn process_command(text: &str) -> String {
    // Placeholder: echo command
    format!("Processed: {}", text)
}