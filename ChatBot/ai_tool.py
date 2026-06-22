import sys
import google.generativeai as genai

FEATURES = {
    "1": {
        "name": "Explain a Concept",
        "prompt": "You are a helpful teacher. Explain the following concept clearly and concisely:",
    },
    "2": {
        "name": "Summarize Text",
        "prompt": "You are an expert summarizer. Provide a comprehensive summary of the following text:",
    },
    "3": {
        "name": "Explain Like I'm 5 (ELI5)",
        "prompt": "Explain the following topic to me in very simple terms, as if I were a 5-year-old child:",
    }
}

def get_api_key():
    """Retrieve the API key from environment variable or prompt the user."""
    api_key = input("Please enter your Gemini API key: ").strip()
    if not api_key:
        print("Error: API key is required to use this tool.")
        sys.exit(1)
    return api_key

print("Welcome to the Simple AI Tool!\n")
api_key = get_api_key()
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-3.5-flash")

while True:
    print("\n--- Features Menu ---")
    for key, feature in FEATURES.items():
        print(f"{key}. {feature['name']}")
    print("0. Exit")
    
    choice = input("\nSelect a feature (0-3): ").strip()
    
    if choice == "0":
        print("Goodbye!")
        break
        
    if choice not in FEATURES:
        print("Invalid choice. Please try again.")
        continue

    selected_feature = FEATURES[choice]
    print(f"\n>> You selected: {selected_feature['name']}")
    
    user_input = input("Enter your text/concept: ").strip()
    
    if not user_input:
        print("Error: Input cannot be empty. Please provide some text.")
        continue
    
    full_prompt = f"{selected_feature['prompt']}\n\n{user_input}"
    
    print("\nThinking...")
    try:
        response = model.generate_content(full_prompt)
        print("\n=== AI Response ===")
        print(response.text)
        print("===================\n")
    except Exception as e:
        print(f"\nAn error occurred while contacting the AI LLM: {e}")
