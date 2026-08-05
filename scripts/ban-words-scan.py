import json,re,sys
HARD = """delve leverage foster embark harness streamline facilitate utilize optimize revolutionize empower elevate unleash unlock unveil uncover supercharge skyrocket turbocharge propel amplify catalyze cultivate augment illuminate exemplify underscore resonate captivate reimagine redefine curate boast synthesize harmonize unravel demystify spearhead garner bolster galvanize herald champion spotlight juxtapose encapsulate epitomize embody hone catapult bombard surge dovetail
robust seamless holistic comprehensive pivotal multifaceted nuanced paramount groundbreaking transformative scalable dynamic actionable invaluable meticulous bespoke granular impactful unparalleled undeniable profound remarkable captivating exemplary esteemed commendable enlightening cutting-edge state-of-the-art next-level vibrant bustling nestled formidable compelling stellar marvelous imaginative nimble scrappy bloated fantastic indispensable quintessential unprecedented salient cohesive discerning savvy staggering
premier leading industry-leading top-rated renowned reputable top-notch top-tier world-class best-in-class unmatched unrivaled second-to-none award-winning unbeatable one-of-a-kind
stunning breathtaking gorgeous exquisite sleek sophisticated timeless luxurious opulent sumptuous pristine immaculate elegant lavish plush refined upscale chic dazzling
tapestry realm paradigm synergy testament beacon plethora multitude myriad trailblazer arena arsenal bastion zeitgeist advancement breakthrough enhancement exploration nexus epicenter powerhouse mosaic symphony ecosystem nugget blueprint roadmap playbook wheelhouse gateway springboard game-changer
truly genuinely incredibly significantly deeply highly vastly immensely effortlessly seamlessly notably particularly remarkably absolutely utterly wholly entirely surely undeniably inherently simply literally definitely certainly arguably fundamentally essentially increasingly consistently effectively strategically""".split()
PHRASES = ["when it comes to","trusted partner","one-stop shop","from start to finish","every step of the way","look no further","peace of mind","hassle-free","stress-free","worry-free","go above and beyond","going the extra mile","rest assured","we understand that","we know how","you deserve","let us help you","we've got you covered","in today's","needless to say","it's worth noting","at the end of the day","not only","more than just","second to none","backed by years of experience","experience the difference","the perfect blend","the perfect combination","stand the test of time","elevate your home","top-of-the-line","unparalleled craftsmanship"]
data=json.load(open(sys.argv[1]))
for d in data:
    t=d["text"] or ""
    low=t.lower()
    hits=[]
    for w in HARD:
        for m in re.finditer(r'\b'+re.escape(w)+r'(s|es|ed|ing|er|ly|ity|ful)?\b',low):
            hits.append((w,m.start()))
    ph=[p for p in PHRASES if p in low]
    glue=re.findall(r'[a-z]{2}[.!?][A-Z][a-z]',t)
    if hits or ph or glue:
        print(f"\n=== {d['slug']} ===")
        if hits:
            for w,i in hits: print(f"  WORD  {w!r}  ...{t[max(0,i-45):i+45]}...".replace("\n"," "))
        if ph: print(f"  PHRASE {ph}")
        if glue: print(f"  GLUED  {glue}")
