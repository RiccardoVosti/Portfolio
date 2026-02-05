import pandas as pd
import sqlite3

CSV_FILE = 'global_cars_dataset_synthetic.csv'
OUTPUT_FILE = 'car_brand_distribution.txt'

try:
    # 1. Load the dataset
    df = pd.read_csv(CSV_FILE)
    
    # Auto-detect the brand/make column
    potential_cols = ['Make', 'make', 'Brand', 'brand', 'Manufacturer']
    BRAND_COL = next((c for c in potential_cols if c in df.columns), df.columns[0])

    # 2. SQL Analysis: Count occurrences per Brand
    conn = sqlite3.connect(':memory:')
    df.to_sql('cars', conn, index=False)
    
    query = f'''
        SELECT "{BRAND_COL}" as Brand, COUNT(*) as TotalCount 
        FROM cars 
        GROUP BY "{BRAND_COL}" 
        ORDER BY TotalCount DESC
    '''
    brand_df = pd.read_sql(query, conn)

    # 3. Write the Numbered Table
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        width = 105
        f.write(f"{'=' * width}\n")
        f.write(f"{'GLOBAL CAR BRAND DISTRIBUTION REPORT':^{width}}\n")
        f.write(f"{'=' * width}\n\n")
        
        f.write(f"{'#':<4} {'BRAND NAME':<20} | {'VOLUME SLIDER (█=High, ▒=Mid, ░=Low)':<41} | {'TOTAL UNITS'}\n")
        f.write(f"{'-' * 4}|{'-' * 21}|{'-' * 41}|{'-' * 35}\n")

        # Get max for scaling the visual bars
        max_units = brand_df['TotalCount'].max()

        for i, row in brand_df.iterrows():
            brand = str(row['Brand'])
            count = int(row['TotalCount'])
            
            # Scale the slider relative to the highest brand volume
            scaled_val = (count / max_units) * 100
            full_blocks = int(scaled_val // 10)
            small_blocks = int((scaled_val % 10) // 2)
            
            bar = ("█" * full_blocks) + ("▒" * small_blocks)
            bar_aligned = f"{bar:░<41}"
            
            # Format: Numbered list starting from 1
            line = f"{i+1:<4} {brand:<20} | {bar_aligned} | {count:>8} cars\n"
            f.write(line)
            
        f.write(f"\n{'=' * width}\n")
        f.write(f"{'DATA SOURCE: ' + CSV_FILE:^{width}}\n")
        f.write(f"{'=' * width}\n")

    print(f"✅ Success! Brand report generated: {OUTPUT_FILE}")

except Exception as e:
    print(f"❌ Error: {e}")