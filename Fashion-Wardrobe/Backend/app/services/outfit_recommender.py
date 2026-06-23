"""
Outfit Recommendation Engine
Uses rule-based scoring system with color harmony, body shape, and style matching
"""

from typing import List, Dict
from .color_harmony import score_outfit_colors

TOP_CATEGORIES = {"shirt", "top", "dress", "blouse", "sweater", "jacket", "outerwear"}
BOTTOM_CATEGORIES = {"pants", "skirt", "shorts", "jeans", "trousers", "bottom"}


def normalize_category(category: str) -> str:
    """Normalize UI-friendly category names before scoring."""
    normalized = (category or "").strip().lower()
    aliases = {
        "tops": "top",
        "bottoms": "bottom",
    }
    return aliases.get(normalized, normalized)

# Body shape rules (simplified fashion guidelines)
BODY_SHAPE_RULES = {
    "hourglass": {
        "tops": ["fitted", "wrap", "v-neck"],
        "bottoms": ["fitted", "high-waist", "pencil"],
        "avoid": ["boxy", "oversized"]
    },
    "pear": {
        "tops": ["structured", "bright-colors", "patterns"],
        "bottoms": ["dark-colors", "straight", "bootcut"],
        "avoid": ["tight-bottoms", "tapered"]
    },
    "apple": {
        "tops": ["v-neck", "empire-waist", "flowing"],
        "bottoms": ["bootcut", "wide-leg", "straight"],
        "avoid": ["tight-tops", "belted"]
    },
    "rectangle": {
        "tops": ["peplum", "ruffles", "patterns"],
        "bottoms": ["flared", "tapered", "embellished"],
        "avoid": ["shapeless", "straight"]
    },
    "inverted-triangle": {
        "tops": ["simple", "dark-colors", "v-neck"],
        "bottoms": ["wide-leg", "flared", "patterns"],
        "avoid": ["shoulder-pads", "structured-tops"]
    }
}

# Undertone color matching
UNDERTONE_COLORS = {
    "warm": {
        "best": ["orange", "yellow", "red", "brown", "gold", "peach"],
        "avoid": ["blue", "purple", "silver"]
    },
    "cool": {
        "best": ["blue", "purple", "pink", "silver", "emerald"],
        "avoid": ["orange", "yellow", "gold"]
    },
    "neutral": {
        "best": ["all"],
        "avoid": []
    }
}

def calculate_body_shape_score(items: List[Dict], body_shape: str) -> float:
    """
    Score outfit based on body shape compatibility
    """
    if not body_shape or body_shape not in BODY_SHAPE_RULES:
        return 0.5  # Neutral score if no body shape data
    
    rules = BODY_SHAPE_RULES[body_shape]
    score = 0.5  # Start with neutral
    
    for item in items:
        category = normalize_category(item.get("category", ""))
        subcategory = item.get("subcategory", "").lower()
        
        # Check if item matches recommended styles
        if category in {"shirt", "top", "dress"}:
            for good_style in rules.get("tops", []):
                if good_style in subcategory:
                    score += 0.1
        
        elif category in {"pants", "skirt", "shorts", "bottom"}:
            for good_style in rules.get("bottoms", []):
                if good_style in subcategory:
                    score += 0.1
        
        # Check if item is in avoid list
        for bad_style in rules.get("avoid", []):
            if bad_style in subcategory:
                score -= 0.1
    
    return max(0.0, min(1.0, score))  # Clamp between 0 and 1

def calculate_undertone_score(items: List[Dict], undertone: str) -> float:
    """
    Score outfit based on undertone color matching
    """
    if not undertone or undertone not in UNDERTONE_COLORS:
        return 0.5
    
    rules = UNDERTONE_COLORS[undertone]
    best_colors = rules["best"]
    avoid_colors = rules["avoid"]
    
    if "all" in best_colors:
        return 1.0  # Neutral undertone matches everything
    
    score = 0.5
    for item in items:
        color = item.get("color_primary", "").lower()
        
        if color in best_colors:
            score += 0.15
        elif color in avoid_colors:
            score -= 0.1
    
    return max(0.0, min(1.0, score))

def generate_outfit_score(items: List[Dict], user_profile: Dict) -> float:
    """
    Generate overall outfit score using weighted formula:
    score = 0.4 * color_harmony + 0.4 * body_shape + 0.2 * undertone
    """
    
    # Calculate individual scores
    color_score = score_outfit_colors(items)
    body_shape_score = calculate_body_shape_score(
        items, 
        user_profile.get("body_shape", "")
    )
    undertone_score = calculate_undertone_score(
        items,
        user_profile.get("undertone", "")
    )
    
    # Weighted combination (from the article)
    total_score = (
        0.4 * color_score +
        0.4 * body_shape_score +
        0.2 * undertone_score
    )
    
    return round(total_score, 3)

def recommend_outfits(wardrobe_items: List[Dict], user_profile: Dict, top_k: int = 5) -> List[Dict]:
    """
    Generate outfit recommendations from wardrobe items
    Returns top K outfit combinations with scores
    """
    
    recommendations = []
    
    # Simple algorithm: Pick top + bottom + optional accessory
    tops = [item for item in wardrobe_items if normalize_category(item.get("category", "")) in TOP_CATEGORIES]
    bottoms = [item for item in wardrobe_items if normalize_category(item.get("category", "")) in BOTTOM_CATEGORIES]

    print(f"Found {len(tops)} tops and {len(bottoms)} bottoms")
    # Generate combinations
    for top in tops:
        if normalize_category(top.get("category", "")) == "dress":
            # Dress is a complete outfit
            outfit = [top]
            score = generate_outfit_score(outfit, user_profile)
            recommendations.append({
                "items": outfit,
                "score": score,
                "item_ids": [top["id"]]
            })
        else:
            # Top + Bottom combinations
            for bottom in bottoms:
                outfit = [top, bottom]
                score = generate_outfit_score(outfit, user_profile)
                recommendations.append({
                    "items": outfit,
                    "score": score,
                    "item_ids": [top["id"], bottom["id"]]
                })
    
    # Sort by score (highest first)
    recommendations.sort(key=lambda x: x["score"], reverse=True)
    
    # Return top K
    return recommendations[:top_k]
