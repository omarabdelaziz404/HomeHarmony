from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import random
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with ["http://localhost:3000"] for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Reuse your model training code ===
styles = ['Modern', 'Classic', 'Bohemian', 'Minimalist']
budgets = ['Low', 'Medium', 'High']
sizes = ['Small', 'Medium', 'Large']
designers = ['John', 'Ethan', 'Steve', 'Valeriy']

# Designer specialties for clarity
specialties = {
    'Steve': 'Modern',
    'John': 'Classic',
    'Ethan': 'Bohemian',
    'Valeriy': 'Minimalist'
}

# Designer profiles
designer_profiles = {
    'Steve': {
        'styles': ['Modern', 'Minimalist'],
        'budgets': ['High', 'Medium'],
        'sizes': ['Medium', 'Large']
    },
    'John': {
        'styles': ['Classic', 'Modern'],
        'budgets': ['Low', 'Medium'],
        'sizes': ['Small', 'Medium']
    },
    'Ethan': {
        'styles': ['Bohemian', 'Classic'],
        'budgets': ['Low', 'Medium'],
        'sizes': ['Large', 'Medium']
    },
    'Valeriy': {
        'styles': ['Minimalist', 'Modern'],
        'budgets': ['Medium', 'High'],
        'sizes': ['Small', 'Medium', 'Large']
    }
}

def match_designer(style, budget, size):
    best_matches = []
    for designer, profile in designer_profiles.items():
        score = 0
        # Style match
        if style in profile['styles']:
            score += 2
        # Budget match
        if budget in profile['budgets']:
            score += 2
        # Size match
        if size in profile['sizes']:
            score += 2
        best_matches.append((designer, score))
    # Sort designers by score descending
    best_matches.sort(key=lambda x: x[1], reverse=True)
    top_score = best_matches[0][1]
    top_designers = [d for d, s in best_matches if s == top_score]
    return random.choice(top_designers) if top_designers else random.choice(list(designer_profiles.keys()))


# Training Data
n_samples = 500
df = pd.DataFrame({
    'Style_Preference': [random.choice(styles) for _ in range(n_samples)],
    'Budget_Level': [random.choice(budgets) for _ in range(n_samples)],
    'Project_Size': [random.choice(sizes) for _ in range(n_samples)],
})
df['Matched_Designer'] = df.apply(lambda row: match_designer(row['Style_Preference'], row['Budget_Level'], row['Project_Size']), axis=1)

# Encoding
le_style = LabelEncoder().fit(styles)
le_budget = LabelEncoder().fit(budgets)
le_size = LabelEncoder().fit(sizes)
le_designer = LabelEncoder().fit(designers)

df['Style_Preference_enc'] = le_style.transform(df['Style_Preference'])
df['Budget_Level_enc'] = le_budget.transform(df['Budget_Level'])
df['Project_Size_enc'] = le_size.transform(df['Project_Size'])
df['Matched_Designer_enc'] = le_designer.transform(df['Matched_Designer'])

X = df[['Style_Preference_enc', 'Budget_Level_enc', 'Project_Size_enc']]
y = df['Matched_Designer_enc']

scaler = StandardScaler().fit(X)
X_scaled = scaler.transform(X)

model = RandomForestClassifier(n_estimators=100, random_state=42).fit(X_scaled, y)

# === API Endpoint ===
@app.get("/recommend-designer")
def recommend_designer(style: str = Query(...), budget: str = Query(...), size: str = Query(...)):
    try:
        input_data = [[
            le_style.transform([style])[0],
            le_budget.transform([budget])[0],
            le_size.transform([size])[0]
        ]]
        input_scaled = scaler.transform(input_data)
        prediction = model.predict(input_scaled)[0]
        result = le_designer.inverse_transform([prediction])[0]
        return {"recommended_designer": result}
    except Exception as e:
        return {"error": str(e)}
