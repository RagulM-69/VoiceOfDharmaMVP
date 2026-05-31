import os
import urllib.request
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def process_logo():
    source_path = r"C:\Users\Ragul\.gemini\antigravity-ide\brain\cfb3eb54-1c00-4e2a-8c79-df57a514a44a\media__1780211434436.png"
    target_path = r"c:\Users\Ragul\OneDrive\Desktop\VOD\public\images\logo.png"
    
    print(f"Opening {source_path}")
    if not os.path.exists(source_path):
        print("Source image not found!")
        return
        
    img = Image.open(source_path).convert("RGBA")
    
    # Try rembg if available, otherwise fallback to color thresholding
    try:
        from rembg import remove
        print("Using rembg for high quality background removal...")
        img_no_bg = remove(img)
        img_no_bg.save(target_path, "PNG")
        print("Logo saved with rembg.")
        return
    except ImportError:
        print("rembg not installed, using PIL thresholding.")
        
    # Manual thresholding (black background removal)
    # We will make near-black pixels transparent
    datas = img.getdata()
    newData = []
    for item in datas:
        # Check if the pixel is dark (R, G, B are all low)
        if item[0] < 15 and item[1] < 15 and item[2] < 15:
            # Make it fully transparent
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    
    # Save the logo
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    img.save(target_path, "PNG")
    print(f"Saved logo to {target_path}")

def create_og_image():
    target_path = r"c:\Users\Ragul\OneDrive\Desktop\VOD\public\images\og-default.png"
    logo_path = r"c:\Users\Ragul\OneDrive\Desktop\VOD\public\images\logo.png"
    
    # Create a 1200x630 background (deep blue to dark gradient)
    width, height = 1200, 630
    og = Image.new("RGBA", (width, height), color="#0A1F44")
    draw = ImageDraw.Draw(og)
    
    # Add a subtle gradient/glow
    for y in range(height):
        # Blend from #0A1F44 at top to #020509 at bottom
        r = int(10 - (10 - 2) * (y / height))
        g = int(31 - (31 - 5) * (y / height))
        b = int(68 - (68 - 9) * (y / height))
        draw.line([(0, y), (width, y)], fill=(r, g, b))
        
    # Add some subtle golden glowing circles in the background
    def draw_glow(x, y, radius, color):
        for r in range(radius, 0, -5):
            alpha = int((1 - (r / radius)) * 40)
            draw.ellipse((x - r, y - r, x + r, y + r), fill=(color[0], color[1], color[2], alpha))
            
    draw_glow(600, 250, 400, (200, 150, 12))
    draw_glow(200, 500, 300, (245, 166, 35))
    
    # Try to download a nice serif font (Cormorant Garamond or similar)
    font_path = "font.ttf"
    if not os.path.exists(font_path):
        try:
            urllib.request.urlretrieve("https://github.com/google/fonts/raw/main/ofl/cormorantgaramond/CormorantGaramond-SemiBold.ttf", font_path)
        except:
            print("Could not download font, using default.")
            font_path = None
            
    sans_font_path = "sans.ttf"
    if not os.path.exists(sans_font_path):
        try:
            urllib.request.urlretrieve("https://github.com/google/fonts/raw/main/ofl/inter/Inter%5Bslnt%2Cwght%5D.ttf", sans_font_path)
        except:
            sans_font_path = None

    try:
        title_font = ImageFont.truetype(font_path, 72) if font_path else ImageFont.load_default()
        subtitle_font = ImageFont.truetype(sans_font_path, 32) if sans_font_path else ImageFont.load_default()
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()

    # Paste logo if exists
    if os.path.exists(logo_path):
        logo = Image.open(logo_path).convert("RGBA")
        
        # Resize logo to fit nicely (e.g., 300x300 max)
        logo.thumbnail((250, 250), Image.Resampling.LANCZOS)
        
        # Calculate position to center the logo horizontally, top third vertically
        logo_x = (width - logo.width) // 2
        logo_y = 100
        
        og.paste(logo, (logo_x, logo_y), logo)
    
    # Add Text
    title_text = "Voice of Dharma Foundation"
    subtitle_text = "Preserving Dharma Through Knowledge & Service"
    
    # Try to center text
    try:
        title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
        title_w = title_bbox[2] - title_bbox[0]
        title_x = (width - title_w) // 2
        
        sub_bbox = draw.textbbox((0, 0), subtitle_text, font=subtitle_font)
        sub_w = sub_bbox[2] - sub_bbox[0]
        sub_x = (width - sub_w) // 2
        
        # Draw title in golden color
        draw.text((title_x, 400), title_text, font=title_font, fill=(245, 166, 35))
        
        # Draw subtitle in light gray/white
        draw.text((sub_x, 500), subtitle_text, font=subtitle_font, fill=(230, 230, 230))
    except Exception as e:
        print("Text drawing error:", e)
        draw.text((300, 400), title_text, fill="yellow")
        draw.text((300, 500), subtitle_text, fill="white")

    # Save OG image
    og.save(target_path, "PNG")
    print(f"Saved OG default image to {target_path}")

if __name__ == "__main__":
    process_logo()
    create_og_image()
