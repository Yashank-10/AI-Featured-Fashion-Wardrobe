"""
Color Harmony Rules for Fashion Recommendations
Based on color theory and complementary/analogous color matching
"""

# Color wheel mapping (simplified)
COLOR_WHEEL = {
    "red": 0,
    "orange": 30,
    "yellow": 60,
    "lime": 90,
    "green": 120,
    "teal": 150,
    "cyan": 180,
    "blue": 210,
    "purple": 270,
    "magenta": 300,
    "pink": 330,
    "white": None,
    "black": None,
    "gray": None,
    "brown": 25,
    "beige": 40,
    "navy": 220
}

# Neutral colors that go with everything
NEUTRAL_COLORS = ["white", "black", "gray", "beige", "navy"]

def get_color_angle(color: str) -> int:
    """Get the angle of a color on the color wheel"""
    color = color.lower()
    return COLOR_WHEEL.get(color, 0)

def is_neutral(color: str) -> bool:
    """Check if a color is neutral"""
    return color.lower() in NEUTRAL_COLORS

def calculate_color_harmony_score(color1: str, color2: str) -> float:
    """
    Calculate harmony score between two colors (0-1)
    Based on color theory rules
    """
    color1 = color1.lower()
    color2 = color2.lower()
    
    # Same color = perfect harmony
    if color1 == color2:
        return 1.0
    
    # Neutrals go with everything
    if is_neutral(color1) or is_neutral(color2):
        return 0.95
    
    # Get angles
    angle1 = get_color_angle(color1)
    angle2 = get_color_angle(color2)
    
    if angle1 is None or angle2 is None:
        return 0.8  # Default for unknown colors
    
    # Calculate difference
    diff = abs(angle1 - angle2)
    if diff > 180:
        diff = 360 - diff
    
    # Scoring rules:
    # 0-30 degrees: Analogous colors (very harmonious)
    if diff <= 30:
        return 0.9
    
    # 150-210 degrees: Complementary colors (bold but works)
    elif 150 <= diff <= 210:
        return 0.85
    
    # 60-120 degrees: Triadic/Split-complementary (moderate)
    elif 60 <= diff <= 120:
        return 0.7
    
    # Other combinations (less harmonious)
    else:
        return 0.5

def score_outfit_colors(items: list) -> float:
    """
    Score the overall color harmony of multiple items
    Returns score between 0 and 1
    """
    if len(items) < 2:
        return 1.0
    
    total_score = 0
    comparisons = 0
    
    # Compare each pair of items
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            color1 = items[i].get("color_primary", "")
            color2 = items[j].get("color_primary", "")
            
            if color1 and color2:
                total_score += calculate_color_harmony_score(color1, color2)
                comparisons += 1
    
    if comparisons == 0:
        return 0.5
    
    return total_score / comparisons