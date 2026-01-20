import json
import re

with open("raw_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

questions = data["questions"]
raw_answers = data["answers"]

processed_answers = {}
current_q_num = None
current_answer_buffer = []

def save_buffer():
    if current_q_num is not None and current_answer_buffer:
        # Join paragraphs with <br><br> or just keep them as paragraphs
        # For HTML, wrapping in <p> is better.
        full_html = "".join([f"<p>{para}</p>" for para in current_answer_buffer])
        processed_answers[current_q_num] = full_html

# Regex to find "1. Savol:", "2. Savol:", etc.
pattern = re.compile(r"^(\d+)\.\s*Savol:")

for line in raw_answers:
    match = pattern.match(line)
    if match:
        # Save previous
        save_buffer()
        # Start new
        current_q_num = int(match.group(1))
        current_answer_buffer = []
        # We might want to exclude the line that says "1. Savol: Blah" because the question is already in the header.
        # But maybe it contains context? 
        # The user's Question file has the question text.
        # The Answer file repeats it. 
        # I will Skip the header line from the answer content to avoid duplication.
    else:
        if current_q_num is not None:
            current_answer_buffer.append(line)

# Save last buffer
save_buffer()

print(f"Processed {len(processed_answers)} answer blocks.")

# Now combine with questions
final_data = []
for i, q_text in enumerate(questions):
    q_id = i + 1
    ans_text = processed_answers.get(q_id, "<p>Javob topilmadi.</p>")
    final_data.append({
        "id": q_id,
        "question": q_text,
        "answer": ans_text
    })

# Output to data.js
js_content = f"const qaData = {json.dumps(final_data, ensure_ascii=False, indent=2)};"

with open("data.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print("Created data.js")
