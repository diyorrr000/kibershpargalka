import docx
import json
import os

def extract_text(filename):
    if not os.path.exists(filename):
        print(f"File not found: {filename}")
        return []
    doc = docx.Document(filename)
    full_text = []
    for para in doc.paragraphs:
        text = para.text.strip()
        if text:
            full_text.append(text)
    return full_text

questions_file = "Kiberxavsizlik savollar.docx"
answers_file = "Kiberxavsizlik savollarga javob.docx"

questions = extract_text(questions_file)
answers = extract_text(answers_file)

print(f"Found {len(questions)} questions and {len(answers)} answers.")

# Basic alignment attempt
# Sometimes answers are split across paragraphs. This is tricky.
# But the user said "80 ta savol" and "mos ravishda 80 ta javob". 
# It's possible the answers document has one paragraph per answer, OR multiple.
# If multiple, it's hard to split without a delimiter.
# Let's inspect the first few items to see the structure if the lengths utilize mismatch.

data = []
min_len = min(len(questions), len(answers))

# Limit to 80 if we can, but if they don't match, we might have an issue.
# Let's create a raw dump first to inspect.

combined = {
    "questions": questions,
    "answers": answers
}

with open("raw_data.json", "w", encoding="utf-8") as f:
    json.dump(combined, f, ensure_ascii=False, indent=2)

print("Dumped raw_data.json")
