import pandas as pd
import os

print("Current Working Directory:", os.getcwd())


# Read the Excel file
df = pd.read_excel('C:/Users/galas/MathTutor/data/vocabulary_data.xlsx')

# Convert the DataFrame to JSON
json_data = df.to_json(orient='records', force_ascii=False)

# Write the JSON data to a file
with open('vocabulary.json', 'w', encoding='utf-8') as f:
    f.write(json_data)
