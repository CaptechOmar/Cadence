"""Regenerates the icon artwork (webOS icons, splash and desktop icon) from the note drawing below.
Needs Python with Pillow, numpy and Playwright. Run it in an empty folder, then copy the files:
  icon.png -> webos/icon-v2.png, largeIcon.png -> webos/largeIcon-v2.png, splash.png -> webos/splash.png,
  desktop.png -> desktop/icon.png.  (Give the webOS icons a new file name when you change them, and update appinfo.json.)
"""
import asyncio, numpy as np
from PIL import Image
from playwright.async_api import async_playwright
GLYPH='''<g fill="#fff"><path d="M194 148 L388 104 V166 L194 210 Z"/><rect x="194" y="148" width="30" height="232"/><rect x="358" y="125" width="30" height="223"/>
<ellipse cx="170" cy="376" rx="58" ry="47" transform="rotate(-20 170 376)"/><ellipse cx="334" cy="344" rx="58" ry="47" transform="rotate(-20 334 344)"/></g>'''
def svg(w,h,bg,glyph_h,rx=0,defs=''):
    # glyph box is about 120..392 x 104..424 (center 256,264); scale so the glyph is glyph_h tall
    s=glyph_h/320; cx,cy=w/2,h/2
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><defs>{defs}</defs>
<rect width="{w}" height="{h}" rx="{rx}" fill="{bg}"/><g transform="translate({cx-256*s} {cy-264*s}) scale({s})">{GLYPH}</g></svg>'''
GRAD='<linearGradient id="g" gradientUnits="objectBoundingBox" x1="0.25" y1="0" x2="0.75" y2="1"><stop offset="0" stop-color="#ff5e6c"/><stop offset=".55" stop-color="#fa243c"/><stop offset="1" stop-color="#c9102a"/></linearGradient>'
TV='#e4374b'
jobs=[
 ('icon.png',160,160,TV,0,0.60,False),
 ('largeIcon.png',260,260,TV,0,0.60,False),
 ('desktop.png',1024,1024,'url(#g)',230,0.52,True),
 ('splash.png',1920,1080,'url(#g)',0,0.36,False),
 ('cadence.png',800,480,'url(#g)',0,0.58,False),
]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); 
        for name,w,h,bg,rx,gh,transp in jobs:
            pg=await b.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
            await pg.set_content(f'<body style="margin:0;background:transparent">{svg(w,h,bg,gh*h if h<w else gh*w,rx,GRAD)}</body>')
            await pg.screenshot(path=name,omit_background=transp)
            await pg.close()
        await b.close()
asyncio.run(main())
# splash: add fine noise so the gradient doesn't band on the TV
im=np.asarray(Image.open('splash.png').convert('RGB')).astype(np.float32)
rng=np.random.default_rng(7); im+=rng.normal(0,1.4,im.shape[:2])[...,None]
Image.fromarray(np.clip(im,0,255).astype(np.uint8)).save('splash.png')
