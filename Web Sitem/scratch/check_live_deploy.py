import urllib.request
import json
import time

url = "https://rotali-fenci.vercel.app/version.json"
print("Checking live version...")
for i in range(12):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            v = data.get('v')
            print(f"[{i+1}] Current live version: {v}")
            if v == "20261017_2221":
                print("SUCCESS: Live site is updated to 20261017_2221!")
                break
    except Exception as e:
        print(f"[{i+1}] Error: {e}")
    time.sleep(10)
