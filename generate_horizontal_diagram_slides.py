import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_horizontal_slides():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    C_BG = RGBColor(248, 250, 252)          # Slate-50 Ultra clean
    C_DARK = RGBColor(15, 23, 42)           # Slate-900 Obsidian Dark
    C_COPPER = RGBColor(234, 88, 12)        # Vibrant Copper Orange #EA580C
    C_SLATE_CARD = RGBColor(255, 255, 255)  # Pure White Cards
    C_BORDER = RGBColor(226, 232, 240)      # Slate-200 Border
    C_MUTED = RGBColor(100, 116, 139)       # Slate-500 Text
    C_GREEN = RGBColor(16, 185, 129)        # Emerald 500
    C_WHITE = RGBColor(255, 255, 255)
    C_DARK_BG = RGBColor(15, 23, 42)
    C_ORANGE_BG = RGBColor(255, 247, 237)   # Orange 50

    FONT_MAIN = "Arial"

    def set_slide_background(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_header(slide, badge_text, title_text, subtitle_text=""):
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.5), Inches(3.2), Inches(0.35))
        badge.fill.solid()
        badge.fill.fore_color.rgb = C_DARK
        badge.line.fill.background()
        tf_b = badge.text_frame
        tf_b.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_b = tf_b.paragraphs[0]
        p_b.text = badge_text.upper()
        p_b.font.name = FONT_MAIN
        p_b.font.size = Pt(11)
        p_b.font.bold = True
        p_b.font.color.rgb = C_WHITE
        p_b.alignment = PP_ALIGN.CENTER

        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.88), Inches(11.7), Inches(0.8))
        tf = tb.text_frame
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.name = FONT_MAIN
        p.font.size = Pt(24)
        p.font.bold = True
        p.font.color.rgb = C_DARK

        if subtitle_text:
            p2 = tf.add_paragraph()
            p2.text = subtitle_text
            p2.font.name = FONT_MAIN
            p2.font.size = Pt(13)
            p2.font.color.rgb = C_MUTED
            p2.space_before = Pt(3)

    def add_arrow(slide, left, top, width, height):
        arr = slide.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, left, top, width, height)
        arr.fill.solid()
        arr.fill.fore_color.rgb = C_COPPER
        arr.line.fill.background()
        return arr

    # ============================================================
    # SLIDE 1: SYSTEM ARCHITECTURE BLOCK DIAGRAM (HORIZONTAL 4 LAYERS)
    # ============================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, C_BG)
    add_header(s1, "System Architecture", "Block Diagram: โครงสร้างระบบ 4 ลำดับชั้นแบบแนวนอน", "สถาปัตยกรรมกระจายศูนย์เชื่อมต่อตั้งแต่ User Interface สู่ On-Chain Smart Contract")

    layers = [
        ("Layer 1: Frontend UI", "React + Vite + Tailwind", [
            "👨‍🔧 Customer Portal",
            "• เช็คแต้มสด (CUP)",
            "• ดูราคาขยะ 46 รายการ",
            "• แลกรางวัล 1-Click",
            "",
            "⚖️ Minter / Staff",
            "• คำนวณเงินสด & แต้ม",
            "• ระบุน้ำหนัก + ใบเสร็จ"
        ], C_SLATE_CARD, C_BORDER),
        ("Layer 2: Web3 Gateway", "Ethers.js & Signer", [
            "🦊 MetaMask Wallet",
            "• ถือกุญแจ Private Key",
            "• Sign ธุรกรรมปลอดภัย",
            "",
            "⚡ Ethers.js Provider",
            "• เชื่อมต่อ RPC Node",
            "• เข้ารหัสข้อมูลตาม ABI",
            "• Read-only Calls (ฟรี)"
        ], C_ORANGE_BG, C_COPPER),
        ("Layer 3: Smart Contract", "CopperPoint.sol", [
            "🔐 Access Control",
            "• Admin / Minter Roles",
            "• โควตาคุมพนักงานชั่ง",
            "",
            "⚙️ Core Logic",
            "• mintWithScrapDetails()",
            "• burnSelf() 1-Click",
            "• Pausable นิรภัยฉุกเฉิน"
        ], C_DARK_BG, C_DARK),
        ("Layer 4: Blockchain & Audit", "Ethereum Sepolia", [
            "⛓️ On-Chain State",
            "• บันทึกยอดกระเป๋าจริง",
            "• Supply หมุนเวียนสด",
            "",
            "📜 Immutable Logs",
            "• Event ScrapTraded",
            "• Event RewardRedeemed",
            "• เช็คผ่าน Etherscan ได้"
        ], C_SLATE_CARD, C_BORDER)
    ]

    card_w = Inches(2.7)
    card_h = Inches(5.1)
    card_y = Inches(1.85)

    for i, (title, sub, bullets, bg_col, border_col) in enumerate(layers):
        x = Inches(0.8 + i * 3.05)
        card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, card_y, card_w, card_h)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_col
        card.line.color.rgb = border_col
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.2)
        tf.margin_right = Inches(0.2)
        tf.margin_top = Inches(0.25)

        is_dark = (bg_col == C_DARK_BG)

        # Title
        p_t = tf.paragraphs[0]
        p_t.text = title
        p_t.font.name = FONT_MAIN
        p_t.font.size = Pt(15)
        p_t.font.bold = True
        p_t.font.color.rgb = C_WHITE if is_dark else C_DARK

        # Subtitle
        p_s = tf.add_paragraph()
        p_s.text = sub
        p_s.font.name = FONT_MAIN
        p_s.font.size = Pt(11)
        p_s.font.color.rgb = C_COPPER if is_dark else C_MUTED
        p_s.space_after = Pt(10)

        # Bullets
        for b in bullets:
            p_b = tf.add_paragraph()
            p_b.text = b
            p_b.font.name = FONT_MAIN
            if b.startswith("👨‍🔧") or b.startswith("⚖️") or b.startswith("🦊") or b.startswith("⚡") or b.startswith("🔐") or b.startswith("⚙️") or b.startswith("⛓️") or b.startswith("📜"):
                p_b.font.size = Pt(12)
                p_b.font.bold = True
                p_b.font.color.rgb = RGBColor(251, 146, 60) if is_dark else C_COPPER
                p_b.space_before = Pt(4)
            else:
                p_b.font.size = Pt(11)
                p_b.font.color.rgb = RGBColor(226, 232, 240) if is_dark else C_DARK

        # Add horizontal arrow between cards
        if i < 3:
            add_arrow(s1, Inches(0.8 + (i+1)*3.05 - 0.28), Inches(4.2), Inches(0.22), Inches(0.28))

    # ============================================================
    # SLIDE 2: 5-STEP HORIZONTAL MINTING WORKFLOW
    # ============================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2, C_BG)
    add_header(s2, "Transaction Workflow", "โฟลว์การทำงาน: การรับซื้อเศษโลหะและออกแต้ม On-Chain (5 ขั้นตอน)", "กระบวนการตั้งแต่ชั่งน้ำหนักหน้าร้านสู่การบันทึก Audit Trail ลงบล็อกเชนแบบอัตโนมัติ")

    steps = [
        ("ขั้นตอนที่ 1", "คัดแยก & ชั่งน้ำหนัก", [
            "• ลูกค้านำเศษโลหะมาขาย",
            "• ชั่งน้ำหนักจริงหน้าร้าน",
            "• คัดแยกเกรด (เช่น ทองแดงปอกสวย 5.2 กก.)"
        ]),
        ("ขั้นตอนที่ 2", "คำนวณเงิน & แต้ม", [
            "• เลือกลิสต์ 46 หมวดหมู่",
            "• ระบบคำนวณเงินสด (บาท)",
            "• คำนวณแต้ม CUP อัตโนมัติ",
            "• ป้อนเลขที่ใบเสร็จรับเงิน"
        ]),
        ("ขั้นตอนที่ 3", "จ่ายเงิน & สั่งออกแต้ม", [
            "• จ่ายเงินสด/โอนให้ลูกค้า",
            "• พนักงานกด 'ออกแต้ม'",
            "• ยืนยันคำสั่งผ่าน MetaMask",
            "• ตรวจสิทธิ์ MINTER_ROLE"
        ]),
        ("ขั้นตอนที่ 4", "Smart Contract สรุปผล", [
            "• เรียก mintWithScrapDetails",
            "• ตรวจสอบเพดานโควตา",
            "• บันทึกชนิด/น้ำหนัก/ใบเสร็จ",
            "• Emit Event ScrapTraded"
        ]),
        ("ขั้นตอนที่ 5", "ลูกค้าได้รับแต้มสด", [
            "• เหรียญ CUP เข้ากระเป๋า",
            "• ยอดอัปเดตบนเว็บทันที",
            "• มีหลักฐานบน Etherscan",
            "• ลูกค้านำไปแลกสิทธิ์ได้"
        ])
    ]

    s_w = Inches(2.2)
    s_h = Inches(4.8)
    s_y = Inches(2.0)

    for i, (step_num, step_title, bullets) in enumerate(steps):
        x = Inches(0.6 + i * 2.45)
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, s_y, s_w, s_h)
        card.fill.solid()
        card.fill.fore_color.rgb = C_SLATE_CARD
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1.5)

        # Header bar in each step
        header_bar = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, s_y, s_w, Inches(0.9))
        header_bar.fill.solid()
        header_bar.fill.fore_color.rgb = C_COPPER if i == 3 else C_DARK
        header_bar.line.fill.background()

        tf_h = header_bar.text_frame
        tf_h.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_h1 = tf_h.paragraphs[0]
        p_h1.text = step_num
        p_h1.font.name = FONT_MAIN
        p_h1.font.size = Pt(10)
        p_h1.font.color.rgb = RGBColor(254, 215, 170) if i == 3 else C_MUTED
        p_h1.alignment = PP_ALIGN.CENTER

        p_h2 = tf_h.add_paragraph()
        p_h2.text = step_title
        p_h2.font.name = FONT_MAIN
        p_h2.font.size = Pt(12)
        p_h2.font.bold = True
        p_h2.font.color.rgb = C_WHITE
        p_h2.alignment = PP_ALIGN.CENTER

        # Body text
        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.18)
        tf.margin_right = Inches(0.18)
        tf.margin_top = Inches(1.05)

        for b in bullets:
            p = tf.add_paragraph()
            p.text = b
            p.font.name = FONT_MAIN
            p.font.size = Pt(11)
            p.font.color.rgb = C_DARK
            p.space_after = Pt(4)

        if i < 4:
            add_arrow(s2, Inches(0.6 + (i+1)*2.45 - 0.2), Inches(4.2), Inches(0.15), Inches(0.24))

    # ============================================================
    # SLIDE 3: 4-STEP HORIZONTAL REDEMPTION / DIRECT BURN FLOW
    # ============================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3, C_BG)
    add_header(s3, "Direct Burn Protocol", "โฟลว์การทำงาน: 1-Click เผาแต้มแลกรางวัลโดยตรง (4 ขั้นตอน)", "ตัดขั้นตอน Approve ซ้ำซ้อน ลูกค้าแลกส่วนลดหรือเงินสดได้ในคลิกเดียว ประหยัดค่าแก๊สและปลอดภัย")

    redeem_steps = [
        ("Step 1", "เลือกรายการแลกรางวัล", [
            "• ลูกค้าล็อกอิน Customer Portal",
            "• ตรวจสอบยอด CUP คงเหลือสด",
            "• เลือกรางวัล (เงินสดรีเบต, คูปองส่วนลด, ของพรีเมียม)"
        ], C_SLATE_CARD, C_BORDER),
        ("Step 2", "ยืนยัน 1-Click ใน MetaMask", [
            "• กดปุ่ม 'แลกทันที (Direct Burn)'",
            "• หน้าต่าง MetaMask ปรากฏขึ้น",
            "• กดยืนยันเซ็นคำสั่ง `burnSelf`",
            "• ไม่ต้องทำ Approve ก่อน"
        ], C_ORANGE_BG, C_COPPER),
        ("Step 3", "เผาทำลายเหรียญ On-Chain", [
            "• Smart Contract ตรวจสอบแต้ม",
            "• ทำลายเหรียญออกจาก Supply ทันที",
            "• ป้องกันการนำแต้มกลับมาใช้ซ้ำ",
            "• Emit Event RewardRedeemed"
        ], C_DARK_BG, C_DARK),
        ("Step 4", "รับเงินสด / รางวัลทันที", [
            "• หน้าร้านตรวจสอบสถานะสำเร็จ",
            "• มอบของรางวัลหรือโอนเงินรีเบต",
            "• ธุรกรรมเสร็จสมบูรณ์ 100%",
            "• ตรวจสอบย้อนหลังได้ทุกเมื่อ"
        ], C_SLATE_CARD, C_BORDER)
    ]

    r_w = Inches(2.7)
    r_h = Inches(4.8)
    r_y = Inches(2.0)

    for i, (st, title, bullets, bg_col, border_col) in enumerate(redeem_steps):
        x = Inches(0.8 + i * 3.05)
        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, r_y, r_w, r_h)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_col
        card.line.color.rgb = border_col
        card.line.width = Pt(1.5)

        is_dark = (bg_col == C_DARK_BG)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.22)
        tf.margin_right = Inches(0.22)
        tf.margin_top = Inches(0.35)

        p1 = tf.paragraphs[0]
        p1.text = st
        p1.font.name = FONT_MAIN
        p1.font.size = Pt(12)
        p1.font.bold = True
        p1.font.color.rgb = RGBColor(251, 146, 60) if is_dark else C_COPPER

        p2 = tf.add_paragraph()
        p2.text = title
        p2.font.name = FONT_MAIN
        p2.font.size = Pt(16)
        p2.font.bold = True
        p2.font.color.rgb = C_WHITE if is_dark else C_DARK
        p2.space_after = Pt(14)

        for b in bullets:
            p = tf.add_paragraph()
            p.text = b
            p.font.name = FONT_MAIN
            p.font.size = Pt(12)
            p.font.color.rgb = RGBColor(226, 232, 240) if is_dark else C_DARK
            p.space_after = Pt(6)

        if i < 3:
            add_arrow(s3, Inches(0.8 + (i+1)*3.05 - 0.28), Inches(4.2), Inches(0.22), Inches(0.28))

    output_path = "SLIDES_BLOCK_DIAGRAM_HORIZONTAL.pptx"
    prs.save(output_path)
    print(f"Saved: {output_path}")

if __name__ == "__main__":
    create_horizontal_slides()
