with open('scripts/build_presentation_5_1.py', 'r', encoding='utf-8') as f:
    text = f.read()

target = "        // Klavye Kontrolleri\n        window.addEventListener('keydown',"
replacement = """        // Dış Pencere (Parent Frame) İletişimi
        window.addEventListener('message', (e) => {
            if (e.data && e.data.type === 'ROTALI_SLIDE_CMD') {
                if (e.data.command === 'nextSlide') nextSlide();
                else if (e.data.command === 'prevSlide') prevSlide();
                else if (e.data.command === 'toggleDrawer') toggleDrawer();
                else if (e.data.command === 'showSlide' && typeof e.data.arg === 'number') showSlide(e.data.arg);
            }
        });

        // Klavye Kontrolleri
        window.addEventListener('keydown',"""

if target in text:
    text = text.replace(target, replacement)
    with open('scripts/build_presentation_5_1.py', 'w', encoding='utf-8') as f:
        f.write(text)
    print("SUCCESS: Added postMessage listener to build script!")
else:
    print("WARNING: target not found!")
