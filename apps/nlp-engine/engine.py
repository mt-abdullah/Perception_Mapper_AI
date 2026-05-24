import re
from langdetect import detect

# Multilingual dictionaries for tone keyword matching
TONE_DICTIONARIES = {
  "en": {
    "Formal": ["therefore", "furthermore", "consequently", "subsequently", "accordingly", "nevertheless"],
    "Assertive": ["must", "definitely", "absolutely", "crucial", "essential", "demand", "unquestionably"],
    "Emotional": ["horrible", "amazing", "wonderful", "terrible", "disgusting", "loved", "hated", "heartbroken"],
    "Cooperative": ["collaborate", "agree", "support", "help", "together", "understanding", "consensus"],
  },
  "ta": {
    "Formal": ["எனவே", "மேலும்", "இதன் விளைவாக", "இருப்பினும்", "முறையாக"],
    "Assertive": ["கண்டிப்பாக", "நிச்சயமாக", "முக்கியமான", "அவசியமான", "உறுதியாக"],
    "Emotional": ["மிகவும்", "அதிர்ச்சி", "அற்புதம்", "கொடுமை", "மகிழ்ச்சி", "வருத்தம்"],
    "Cooperative": ["ஒத்துழைப்பு", "உதவி", "ஒப்புக்கொள்கிறேன்", "ஒன்றாக", "புரிந்துணர்வு"],
  },
  "si": {
    "Formal": ["එබැවින්", "තවද", "එහි ප්‍රතිඵලයක් ලෙස", "කෙසේ වෙතත්", "පරිදි"],
    "Assertive": ["අනිවාර්යයෙන්ම", "නියත වශයෙන්ම", "වැදගත්", "අත්‍යවශ්‍ය", "ස්ථිරවම"],
    "Emotional": ["ඉතාමත්", "කණගාටුයි", "අතිශය", "පුදුම සහගත", "භයානක"],
    "Cooperative": ["සහයෝගීතාවය", "එකඟතාවය", "සහාය", "එක්ව", "අන්‍යෝන්‍ය"],
  }
}

# Cognitive bias keyword classification
BIAS_DICTIONARIES = {
  "en": [
    {
      "pattern": r"\b(always|never|everyone|nobody)\b",
      "type": "Over-generalization",
      "description": "Uses absolute statements that fail to accommodate context nuances.",
      "rephrase": "most cases / some individuals"
    },
    {
      "pattern": r"\b(obviously|clearly|undeniably|without a doubt)\b",
      "type": "Confirmation Bias",
      "description": "Presents assumptions as verified absolute facts to reinforce beliefs.",
      "rephrase": "evidence suggests / indications point to"
    },
    {
      "pattern": r"\b(shocking|unbelievable|disaster|conspiracy|crisis)\b",
      "type": "Sensationalism",
      "description": "Employs dramatic phrasing to provoke visceral emotional reactions rather than objective analysis.",
      "rephrase": "significant / noteworthy event / challenging circumstance"
    }
  ],
  "ta": [
    {
      "pattern": r"\b(எப்போதுமே|ஒருபோதும்|எல்லாரும்|யாரும்)\b",
      "type": "Over-generalization (பொதுமைப்படுத்தல் சார்பு)",
      "description": "சூழல் நுணுக்கங்களுக்கு இடமளிக்காத முழுமையான அறிக்கைகளைப் பயன்படுத்துகிறது.",
      "rephrase": "பெரும்பாலான சந்தர்ப்பங்களில் / சில தனிநபர்கள்"
    },
    {
      "pattern": r"\b(வெளிப்படையாக|நிச்சயமாக|சந்தேகமின்றி)\b",
      "type": "Confirmation Bias (உறுதிப்படுத்தல் சார்பு)",
      "description": "நம்பிக்கைகளை வலுப்படுத்த சரிபார்க்கப்பட்ட உண்மைகளாக அனுமானங்களை முன்வைக்கிறது.",
      "rephrase": "சான்றுகள் குறிப்பிடுகின்றன / சுட்டிக்காட்டுகின்றன"
    },
    {
      "pattern": r"\b(அதிர்ச்சி|பேரழிவு|சதி|நெருக்கடி)\b",
      "type": "Sensationalism (உணர்ச்சிவசப்படுத்துதல் சார்பு)",
      "description": "பகுப்பாய்வை விட உணர்ச்சிபூர்வமான எதிர்வினைகளைத் தூண்டுவதற்கு வியத்தகு சொற்களைப் பயன்படுத்துகிறது.",
      "rephrase": "கவனிக்கத்தக்க நிகழ்வு / சவாலான சூழ்நிலை"
    }
  ],
  "si": [
    {
      "pattern": r"\b(සෑමවිටම|කිසිවිටෙකත්|සෑමදෙනාම|කිසිවෙකුත්)\b",
      "type": "Over-generalization (අති-සාමාන්‍යකරණය)",
      "description": "සන්දර්භීය සූක්ෂ්මතා සැලකිල්ලට නොගෙන නිරපේක්ෂ ප්‍රකාශ භාවිතා කරයි.",
      "rephrase": "බොහෝ අවස්ථාවලදී / සමහර පුද්ගලයන්"
    },
    {
      "pattern": r"\b(පැහැදිලිවම|නිසැකවම|සැකයකින් තොරව)\b",
      "type": "Confirmation Bias (තහවුරු කිරීමේ නැඹුරුව)",
      "description": "විශ්වාසයන් ශක්තිමත් කිරීම සඳහා උපකල්පන සත්‍යාපිත කරුණු ලෙස ඉදිරිපත් කරයි.",
      "rephrase": "සාක්ෂි මගින් පෙන්වා දෙන්නේ / ඉඟි කරන්නේ"
    },
    {
      "pattern": r"\b(අතිශය|ව්‍යසනයක්|කුමන්ත්‍රණය|අර්බුදය)\b",
      "type": "Sensationalism (ආන්දෝලනාත්මකකරණය)",
      "description": "විෂයමූලික විශ්ලේෂණයකට වඩා හැඟීම් අවදි කිරීමට නාට්‍යමය වාක්‍ය ඛණ්ඩ භාවිතා කරයි.",
      "rephrase": "සැලකිය යුතු / අභියෝගාත්මක තත්ත්වය"
    }
  ]
}

def analyze_perception(text: str):
  # 1. Detect language
  try:
    detected_lang = detect(text)
    if detected_lang not in ["ta", "si"]:
      detected_lang = "en"
  except Exception:
    detected_lang = "en"
    
  language_names = {"en": "English", "ta": "Tamil", "si": "Sinhala"}
  lang_label = language_names.get(detected_lang, "English")

  # 2. Tone calculations (keyword frequency matching)
  tones = []
  words = re.findall(r"\w+", text.lower())
  total_words = len(words) if len(words) > 0 else 1

  dict_to_use = TONE_DICTIONARIES.get(detected_lang, TONE_DICTIONARIES["en"])
  
  default_scores = {
    "en": {"Informative": 70, "Assertive": 30, "Cooperative": 50, "Formal": 40},
    "ta": {"Informative": 65, "Assertive": 25, "Cooperative": 55, "Formal": 45},
    "si": {"Informative": 68, "Assertive": 28, "Cooperative": 52, "Formal": 42}
  }
  
  scores = default_scores[detected_lang].copy()
  
  for tone, keywords in dict_to_use.items():
    match_count = sum(1 for w in words if w in keywords)
    # Increment core scores dynamically based on matches
    if match_count > 0:
      scores[tone] = min(100, scores[tone] + (match_count * 15))

  tone_colors = {
    "Informative": "from-blue-500 to-indigo-500",
    "Formal": "from-slate-500 to-slate-700",
    "Assertive": "from-purple-500 to-pink-500",
    "Cooperative": "from-emerald-500 to-teal-500",
    "Emotional": "from-red-500 to-orange-500"
  }

  for name, score in scores.items():
    tones.append({
      "name": name,
      "score": score,
      "color": tone_colors.get(name, "from-slate-500 to-slate-700")
    })

  # 3. Bias scans (regex pattern matching)
  biases = []
  bias_index = 20 # baseline
  
  rules_to_use = BIAS_DICTIONARIES.get(detected_lang, BIAS_DICTIONARIES["en"])
  
  for rule in rules_to_use:
    matches = re.finditer(rule["pattern"], text, re.IGNORECASE)
    for match in matches:
      matched_text = match.group(0)
      
      # Extract sentence surrounding match
      start = max(0, text.rfind(".", 0, match.start()) + 1)
      end = text.find(".", match.end())
      if end == -1:
        end = len(text)
      sentence = text[start:end].strip()
      
      # Substitute biased term with objective alternative
      rephrased_sentence = re.sub(
        re.escape(matched_text), 
        rule["rephrase"], 
        sentence, 
        flags=re.IGNORECASE
      )
      
      biases.append({
        "quote": sentence if len(sentence) < 150 else sentence[:147] + "...",
        "type": rule["type"],
        "description": rule["description"],
        "rephrase": rephrased_sentence
      })
      bias_index = min(100, bias_index + 25)

  return {
    "language": lang_label,
    "scores": {
      "sentiment": 75 if bias_index < 50 else 45,
      "objectivity": max(0, 100 - bias_index),
      "biasIndex": bias_index
    },
    "tones": tones,
    "biases": biases if biases else [{
      "quote": text[:60] + "..." if len(text) > 60 else text,
      "type": "Objective Statement",
      "description": "No immediate high-level cognitive bias patterns matched.",
      "rephrase": "Content is balanced and ready for output."
    }]
  }
