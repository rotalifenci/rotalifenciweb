import shutil

with open('oyunlar/uzay-ekspresi-7.html', 'r', encoding='utf-8') as f:
    c = f.read()

# Add fallback onerror to question-image and pause-q-image
c = c.replace(
    'id="question-image" src="" alt="Soru Görseli"',
    'id="question-image" src="" alt="Soru Görseli" onerror="if(!this.src.includes(\'../\')) this.src=\'../\'+this.getAttribute(\'data-src\');"'
)
c = c.replace(
    'id="pause-q-image" src="" alt="Soru Görseli"',
    'id="pause-q-image" src="" alt="Soru Görseli" onerror="if(!this.src.includes(\'../\')) this.src=\'../\'+this.getAttribute(\'data-src\');"'
)

# And in showQuestionBanner and startQuestionPause set data-src as well
c = c.replace(
    'qImg.src = q.image;',
    'qImg.setAttribute("data-src", q.image); qImg.src = q.image;'
)
c = c.replace(
    'pauseImg.src = q.image;',
    'pauseImg.setAttribute("data-src", q.image); pauseImg.src = q.image;'
)

with open('oyunlar/uzay-ekspresi-7.html', 'w', encoding='utf-8') as f:
    f.write(c)

shutil.copyfile('oyunlar/uzay-ekspresi-7.html', '../oyunlar/uzay-ekspresi-7.html')
shutil.copyfile('oyunlar/uzay-ekspresi-7.html', '../Eğitsel Oyun/uzay-ekspresi-7.html')
print("Updated images and fallback on error in all copies of uzay-ekspresi-7.html")
