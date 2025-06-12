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
styles = ['Modern', 'Classic', 'Bohemian', 'Industrial', 'Minimalist']
budgets = ['Low', 'Medium', 'High']
sizes = ['Small', 'Medium', 'Large']
designers = ['D1', 'D2', 'D3', 'D4']

def match_designer(style, budget, size):
    if style == 'Modern' and budget == 'High':
        return 'D1'
    elif style in ['Classic', 'Minimalist'] and budget in ['Medium', 'High']:
        return 'D2'
    elif style == 'Bohemian' or size == 'Large':
        return 'D3'
    elif budget == 'Low' and size == 'Small':
        return 'D4'
    else:
        return random.choice(designers)

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
