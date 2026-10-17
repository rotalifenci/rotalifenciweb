import json

with open(r'C:\Users\my pc\.gemini\antigravity\brain\76e370d0-33ce-4a14-8375-08210d748d8a\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        obj = json.loads(line)
        if obj.get('type') == 'USER_INPUT':
            c = str(obj.get('content', ''))
            if 'video' in c.lower() or '6.' in c:
                clean = c[:140].replace('\n', ' ')
                print(f"STEP {obj.get('step_index')}: {clean}")
