import pandas as pd
import sys

# Input CSV file (replace with your actual filename)
input_file = "./TOI.csv"

'''
required_columns = {
    "koi_period": "Orbital Period",
    "koi_prad": "Planetary Radius",
    "koi_duration": "Transit Duration",
    "koi_depth": "Transit Depth",
    "koi_steff": "Star’s Effective Temperature",
    "koi_srad": "Star’s Radius",
    "koi_slogg": "Star’s Surface Gravity",
    "koi_score": "Disposition"
}
'''

required_columns = {
    "pl_orbper": "Orbital Period [days]",
    "pl_rade": "Planetary Radius [Earth Radius]",
    "pl_trandurh": "Transit Duration [hours]",
    "pl_trandep": "Transit Depth [ppm]",
    "st_teff": "Star’s Effective Temperature [K]",
    "st_rad": "Star’s Radius [Solar Radius]",
    "st_logg": "Star’s Surface Gravity [cm/s²]",
    "tfopwg_disp": "Disposition"
}



# Read CSV, skipping comment lines if any
try:
    df = pd.read_csv(input_file, comment='#')
except FileNotFoundError:
    sys.exit(f"Error: File not found: {input_file}")
except pd.errors.ParserError as e:
    sys.exit(f"Error parsing CSV: {e}")

# Check all required columns are present
missing_cols = [col for col in required_columns if col not in df.columns]
if missing_cols:
    sys.exit(f"Error: Missing required columns: {missing_cols}")

# Keep only required columns and rename them
df_clean = df[list(required_columns.keys())].rename(columns=required_columns)

# Optionally save to new CSV
output_file = "toi_cleaned_exoplanet_data.csv"
df_clean.to_csv(output_file, index=False)
print(f"Cleaned CSV saved to {output_file}")