import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_modern_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # --- Modern Tech & Industrial Copper Palette ---
    C_BG = RGBColor(248, 250, 252)          # Slate-50 Ultra clean
    C_DARK = RGBColor(15, 23, 42)           # Slate-900 Obsidian Dark
    C_COPPER = RGBColor(234, 88, 12)        # Vibrant Copper Orange #EA580C
    C_AMBER = RGBColor(217, 119, 6)         # Deep Amber #D97706
    C_SLATE_CARD = RGBColor(255, 255, 255)  # Pure White Cards
    C_BORDER = RGBColor(226, 232, 240)      # Slate-200 Border
    C_MUTED = RGBColor(100, 116, 139)       # Slate-500 Text
    C_GREEN = RGBColor(16, 185, 129)        # Emerald 500 (Verified)
    C_GREEN_BG = RGBColor(236, 253, 245)    # Emerald 50 Light
    C_DARK_BG = RGBColor(15, 23, 42)        # For dark highlight cards
    C_WHITE = RGBColor(255, 255, 255)

    FONT_MAIN = "Arial"

    def set_slide_background(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_top_nav(slide, tracker_tag, title_text, dark_mode=False):
        # Category Tag Badge
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.55), Inches(3.2), Inches(0.36))
        badge.fill.solid()
        badge.fill.fore_color.rgb = C_DARK if not dark_mode else C_COPPER
        badge.line.fill.background()
        tf_b = badge.text_frame
        tf_b.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_b = tf_b.paragraphs[0]
        p_b.text = tracker_tag.upper()
        p_b.font.name = FONT_MAIN
        p_b.font.size = Pt(11)
        p_b.font.bold = True
        p_b.font.color.rgb = C_WHITE
        p_b.alignment = PP_ALIGN.CENTER

        # Main Title
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.95), Inches(11.7), Inches(0.8))
        tf = tb.text_frame
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.name = FONT_MAIN
        p.font.size = Pt(26)
        p.font.bold = True
        p.font.color.rgb = C_WHITE if dark_mode else C_DARK

    def add_bento_box(slide, left, top, width, height, title, subtitle="", bg_color=C_SLATE_CARD, border_color=C_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.vertical_anchor = MSO_ANCHOR.TOP
        tf.margin_left = Inches(0.35)
        tf.margin_right = Inches(0.35)
        tf.margin_top = Inches(0.3)
        tf.margin_bottom = Inches(0.3)

        if title:
            p_t = tf.paragraphs[0]
            p_t.text = title
            p_t.font.name = FONT_MAIN
            p_t.font.size = Pt(18)
            p_t.font.bold = True
            p_t.font.color.rgb = C_WHITE if bg_color == C_DARK_BG else C_DARK
            p_t.space_after = Pt(4)

        if subtitle:
            p_s = tf.add_paragraph()
            p_s.text = subtitle
            p_s.font.name = FONT_MAIN
            p_s.font.size = Pt(13)
            p_s.font.color.rgb = C_COPPER if bg_color == C_DARK_BG else C_MUTED
            p_s.space_after = Pt(12)

        return card, tf

    # ============================================================
    # SLIDE 1: ULTRA-MODERN COVER (Hero Pitch Style)
    # ============================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, C_DARK_BG)

    # Decorative Accent Glow
    accent = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.2), Inches(3.6), Inches(0.4))
    accent.fill.solid()
    accent.fill.fore_color.rgb = C_COPPER
    accent.line.fill.background()
    p_acc = accent.text_frame.paragraphs[0]
    p_acc.text = "BLOCKCHAIN FOR CIRCULAR ECONOMY"
    p_acc.font.name = FONT_MAIN
    p_acc.font.size = Pt(12)
    p_acc.font.bold = True
    p_acc.font.color.rgb = C_WHITE
    p_acc.alignment = PP_ALIGN.CENTER

    # Hero Title
    tb_t = s1.shapes.add_textbox(Inches(0.8), Inches(1.7), Inches(11.7), Inches(2.2))
    tf_t = tb_t.text_frame
    p1 = tf_t.paragraphs[0]
    p1.text = "COPPERPOINT PROTOCOL"
    p1.font.name = FONT_MAIN
    p1.font.size = Pt(54)
    p1.font.bold = True
    p1.font.color.rgb = C_WHITE

    p2 = tf_t.add_paragraph()
    p2.text = "นวัตกรรมระบบแต้มสะสมและตรวจสอบย้อนหลังการรีไซเคิลเศษทองแดงบนบล็อกเชน (ERC-20)"
    p2.font.name = FONT_MAIN
    p2.font.size = Pt(22)
    p2.font.color.rgb = RGBColor(203, 213, 225)
    p2.space_before = Pt(8)

    # 3 Stat Metric Badges on Cover
    metrics = [
        ("46 รายการ", "แคตตาล็อกเศษโลหะ & สายไฟ"),
        ("1-Click Burn", "แลกเงินสด/รางวัล ไม่ต้อง Approve"),
        ("Sepolia Verified", "สัญญาเปิดเผยซอร์สโค้ด 100%")
    ]
    for idx, (m_val, m_lbl) in enumerate(metrics):
        b = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + idx * 4.0), Inches(3.9), Inches(3.7), Inches(1.3))
        b.fill.solid()
        b.fill.fore_color.rgb = RGBColor(30, 41, 59)
        b.line.color.rgb = RGBColor(51, 65, 85)
        tf_b = b.text_frame
        tf_b.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_val = tf_b.paragraphs[0]
        p_val.text = m_val
        p_val.font.name = FONT_MAIN
        p_val.font.size = Pt(24)
        p_val.font.bold = True
        p_val.font.color.rgb = C_COPPER
        p_val.alignment = PP_ALIGN.CENTER
        
        p_lbl = tf_b.add_paragraph()
        p_lbl.text = m_lbl
        p_lbl.font.name = FONT_MAIN
        p_lbl.font.size = Pt(13)
        p_lbl.font.color.rgb = RGBColor(148, 163, 184)
        p_lbl.alignment = PP_ALIGN.CENTER

    # Cover Footer Info
    tb_foot = s1.shapes.add_textbox(Inches(0.8), Inches(5.6), Inches(11.7), Inches(1.2))
    tf_f = tb_foot.text_frame
    pf1 = tf_f.paragraphs[0]
    pf1.text = "มหาวิทยาลัยรามคำแหง • ภาควิชาวิศวกรรมคอมพิวเตอร์ (RAMKHAMHAENG UNIVERSITY)"
    pf1.font.name = FONT_MAIN
    pf1.font.size = Pt(14)
    pf1.font.bold = True
    pf1.font.color.rgb = RGBColor(148, 163, 184)

    pf2 = tf_f.add_paragraph()
    pf2.text = "ผู้นำเสนอ: [ระบุชื่อ-นามสกุล และ รหัสนักศึกษา]  |  อาจารย์ที่ปรึกษา: อ.พิชัย สุวรรณลอยล่อง"
    pf2.font.name = FONT_MAIN
    pf2.font.size = Pt(13)
    pf2.font.color.rgb = RGBColor(100, 116, 139)
    pf2.space_before = Pt(4)

    # ============================================================
    # SLIDE 2: THE PROBLEM (Visual Challenge Breakdown)
    # ============================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2, C_BG)
    add_top_nav(s2, "Industrial Challenge", "3 จุดบอดสำคัญของธุรกิจรับซื้อของเก่าแบบดั้งเดิม")

    pains = [
        ("❌ ความไม่โปร่งใสของข้อมูล", "Centralized Database Risks", "ข้อมูลน้ำหนักและราคารับซื้อถูกบันทึกในสมุดหรือระบบ POS รวมศูนย์ แอดมินสามารถแก้ไข ลบ หรือเปลี่ยนแปลงย้อนหลังได้โดยไร้ร่องรอย"),
        ("❌ ลูกค้าขาดความเชื่อมั่น", "Zero Customer Self-Custody", "ลูกค้าประจำไม่มีสิทธิ์เป็นเจ้าของแต้มจริง (Custody) หากร้านปิดกิจการหรือระบบล่ม แต้มจะหายทันที อีกทั้งไม่สามารถตรวจสอบเกรดโลหะที่บันทึกได้"),
        ("❌ โครงสร้างขาดการตรวจสอบ", "Lack of On-Chain Traceability", "อุตสาหกรรมรีไซเคิลทองแดงมีหลายเกรด (ปอกสวย, ท่อแอร์, เผาไฟ) ระบบดั้งเดิมไม่มีหลักฐาน Audit Trail ที่ระบุน้ำหนักจริงและเลขที่ใบเสร็จ")
    ]
    for idx, (p_title, p_sub, p_desc) in enumerate(pains):
        card, tf = add_bento_box(s2, Inches(0.8 + idx * 4.0), Inches(2.2), Inches(3.7), Inches(4.7), p_title, p_sub)
        p = tf.add_paragraph()
        p.text = p_desc
        p.font.name = FONT_MAIN
        p.font.size = Pt(15)
        p.font.color.rgb = C_DARK
        p.space_after = Pt(10)

    # ============================================================
    # SLIDE 3: THE SOLUTION (Bento Grid Architecture)
    # ============================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3, C_BG)
    add_top_nav(s3, "Solution Overview", "CopperPoint: บล็อกเชนเปลี่ยนขยะรีไซเคิลสู่ระบบแต้มโปร่งใส")

    # Big Feature Card (Left)
    c_left, tf_l = add_bento_box(s3, Inches(0.8), Inches(2.2), Inches(6.0), Inches(4.7), "⚡ 1-Click Direct Burn Protocol", "นวัตกรรมเผาแต้มแลกรางวัลโดยตรง", bg_color=C_DARK_BG)
    p_l1 = tf_l.add_paragraph()
    p_l1.text = "ในระบบ ERC-20 ปกติ ลูกค้าต้องทำ 2 ขั้นตอน (Approve แล้วรอ Merchant หักแต้ม) ซึ่งยุ่งยากและเสียค่าแก๊สซ้ำซ้อน\n\nCopperPoint พัฒนาฟังก์ชัน `burnSelf` ให้ลูกค้ากดแลกรางวัลหรือรีเบตเงินสดได้ในคลิกเดียว เหรียญถูกเผาออกจาก Supply ในบล็อกเชนจริงทันที ไม่ต้องรอการอนุมัติใดๆ"
    p_l1.font.size = Pt(16)
    p_l1.font.color.rgb = RGBColor(226, 232, 240)

    # Two Stacked Cards (Right)
    c_r1, tf_r1 = add_bento_box(s3, Inches(7.1), Inches(2.2), Inches(5.4), Inches(2.25), "📦 On-Chain Scrap Audit Trail", "บันทึกเกรด น้ำหนัก ใบเสร็จถาวร")
    p_r1 = tf_r1.add_paragraph()
    p_r1.text = "ฟังก์ชัน `mintWithScrapDetails` ผูกประเภททองแดง, น้ำหนัก (กรัม), และเลขที่ใบเสร็จ/IPFS Hash เข้ากับประวัติบล็อกเชน ป้องกันการโกงน้ำหนัก 100%"
    p_r1.font.size = Pt(14)
    p_r1.font.color.rgb = C_DARK

    c_r2, tf_r2 = add_bento_box(s3, Inches(7.1), Inches(4.65), Inches(5.4), Inches(2.25), "🦊 Self-Custody ใน MetaMask", "ลูกค้าเป็นเจ้าของทรัพย์สินอย่างแท้จริง")
    p_r2 = tf_r2.add_paragraph()
    p_r2.text = "แต้มสะสม CUP อยู่ในกระเป๋าส่วนตัวของลูกค้า ไม่ได้อยู่ในฐานข้อมูลของร้านค้า สามารถโอน ย้าย หรือตรวจสอบบน Sepolia Etherscan ได้ทุกที่ทุกเวลา"
    p_r2.font.size = Pt(14)
    p_r2.font.color.rgb = C_DARK

    # ============================================================
    # SLIDE 4: SYSTEM ECOSYSTEM & 46 SCRAP ENGINE
    # ============================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4, C_BG)
    add_top_nav(s4, "Scrap Engine", "กลไกเศรษฐศาสตร์และแคตตาล็อกเศษโลหะ 46 รายการ")

    items_eco = [
        ("ทองแดงเกรดพรีเมียม", "ทองแดงปอกสวย, ท่อแอร์ใหม่, บัสบาร์", "รับซื้อ 260-310 บ./กก.", "เหมาะกับช่างไฟและผู้รับเหมา"),
        ("ทองแดงเกรดรีไซเคิล", "ทองแดงเผาไฟ, ขดลวดมอเตอร์, หม้อน้ำ", "รับซื้อ 180-245 บ./กก.", "ผ่านกระบวนการคัดแยกอุตสาหกรรม"),
        ("สายไฟ & อุปกรณ์", "สายไฟ VAF, THW, สายไฟรถยนต์", "รับซื้อ 80-160 บ./กก.", "คำนวณเนื้อทองแดงสุทธิ"),
        ("ทองเหลือง & E-Waste", "ทองเหลืองหนา, แผงวงจรคอมพิวเตอร์", "รับซื้อ 140-200 บ./กก.", "รองรับขยะอิเล็กทรอนิกส์ครบวงจร")
    ]
    for idx, (cat_t, cat_sub, cat_rate, cat_target) in enumerate(items_eco):
        card, tf = add_bento_box(s4, Inches(0.8 + idx * 3.0), Inches(2.2), Inches(2.8), Inches(4.7), cat_t, cat_sub)
        p1 = tf.add_paragraph()
        p1.text = f"💰 {cat_rate}\n\n🎯 {cat_target}\n\n⭐ อัตราการให้แต้ม:\nยอดขายทุก 20 บาท = 1 แต้ม CUP (คิดเป็น Cashback รีเบต 5% สำหรับผู้ขาย)"
        p1.font.size = Pt(14)
        p1.font.color.rgb = C_DARK

    # ============================================================
    # SLIDE 5: USER EXPERIENCE (3 ROLES)
    # ============================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5, C_BG)
    add_top_nav(s5, "User Roles", "3 บทบาทการใช้งานบนเว็บแอปพลิเคชัน (Vite + React)")

    roles = [
        ("👨‍🔧 ผู้ขาย / ลูกค้า", "Customer Interface", [
            "• ดูบัตรสมาชิกและยอดแต้มสะสมสด (185,000 CUP)",
            "• ตรวจสอบใบราคา 46 รายการแบบเรียลไทม์",
            "• ปุ่มลัด 'โอนเข้ากระเป๋าฉัน' สำหรับขายเศษทองแดง",
            "• แลกเงินสดหรือของรางวัลในคลิกเดียว (Direct Burn)"
        ]),
        ("⚖️ พนักงานชั่ง & ออกแต้ม", "Staff / Minter Interface", [
            "• เลือกประเภทขยะโลหะและระบุน้ำหนักที่ชั่งได้จริง",
            "• คำนวณราคาเงินสดและแต้มที่จะได้รับอัตโนมัติ",
            "• บันทึกเลขที่ใบเสร็จลงบล็อกเชน (Receipt ID)",
            "• สั่ง Mint แต้มเข้ากระเป๋าลูกค้าด้วย MINTER_ROLE"
        ]),
        ("🛡️ ผู้ดูแล & สรุปกำไร", "Admin Governance", [
            "• ดูสรุปยอดรับซื้อ กำไรส่วนต่าง และแต้มหมุนเวียน",
            "• จัดการมอบ/ถอนสิทธิ์พนักงานชั่ง (Grant/Revoke)",
            "• ปุ่มหยุดระบบฉุกเฉิน (Emergency Pause)",
            "• ตรวจสอบสถิติ On-Chain ทั้งหมด"
        ])
    ]
    for idx, (r_title, r_sub, r_items) in enumerate(roles):
        card, tf = add_bento_box(s5, Inches(0.8 + idx * 4.0), Inches(2.2), Inches(3.7), Inches(4.7), r_title, r_sub)
        for it in r_items:
            p = tf.add_paragraph()
            p.text = it
            p.font.size = Pt(14)
            p.font.color.rgb = C_DARK
            p.space_after = Pt(8)

    # ============================================================
    # SLIDE 6: ETHERSCAN ARCHITECTURE DEEP DIVE (The 2 Screens!)
    # ============================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6, C_BG)
    add_top_nav(s6, "Smart Contract Interface", "โครงสร้างฟังก์ชันสัญญา: Read Contract vs Write Contract")

    # Read Contract Card
    c_read, tf_read = add_bento_box(s6, Inches(0.8), Inches(2.2), Inches(5.7), Inches(4.7), "📖 Read Contract (อ่านข้อมูลฟรี)", "ไม่ต้องเสีย Gas • ไม่ต้องเชื่อมต่อกระเป๋า")
    read_bullets = [
        "• `balanceOf(account)`: ตรวจยอดแต้มคงเหลือของลูกค้าคนใดก็ได้ในโลก",
        "• `hasRole(role, account)`: ตรวจสอบสิทธิ์ เช่น กระเป๋านี้เป็นพนักงานชั่งจริงไหม?",
        "• `totalSupply()`: ยอดแต้มสะสม CUP ทั้งหมดที่หมุนเวียนในระบบ",
        "• `paused()`: สถานะความปลอดภัย (ระบบเปิดปกติหรือแช่แข็งชั่วคราว)",
        "• `getMinterQuotaRemaining(minter)`: ตรวจสอบโควตาแต้มคงเหลือของพนักงาน"
    ]
    for b in read_bullets:
        p = tf_read.add_paragraph()
        p.text = b
        p.font.size = Pt(14)
        p.font.color.rgb = C_DARK
        p.space_after = Pt(8)

    # Write Contract Card
    c_write, tf_write = add_bento_box(s6, Inches(6.8), Inches(2.2), Inches(5.7), Inches(4.7), "✍️ Write Contract (สั่งงานลงเชน)", "ต้องเชื่อม MetaMask • มีการเปลี่ยนสถานะบนเชน")
    write_bullets = [
        "• `mintWithScrapDetails(...)`: พนักงานชั่งส่งข้อมูลทองแดง น้ำหนัก และออกแต้ม",
        "• `burnSelf(amount, reason)`: ลูกค้ากดเผาแต้มแลกรางวัลทันทีใน 1-Click",
        "• `grantRole(role, account)`: แอดมินแต่งตั้งพนักงานชั่งคนใหม่หน้าลาน",
        "• `revokeRole(role, account)`: แอดมินสั่งปลดสิทธิ์พนักงานทันที",
        "• `setPaused(true/false)`: สวิตช์นิรภัยสั่งหยุดระบบเมื่อเกิดเหตุฉุกเฉิน"
    ]
    for b in write_bullets:
        p = tf_write.add_paragraph()
        p.text = b
        p.font.size = Pt(14)
        p.font.color.rgb = C_DARK
        p.space_after = Pt(8)

    # ============================================================
    # SLIDE 7: LIVE SEPOLIA DEPLOYMENT & VERIFICATION
    # ============================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7, C_BG)
    add_top_nav(s7, "On-Chain Evidence", "หลักฐานความสำเร็จบนเครือข่าย Ethereum Sepolia จริง")

    card_live, tf_live = add_bento_box(s7, Inches(0.8), Inches(2.2), Inches(11.7), Inches(4.7), "✅ สัญญาได้รับการ VERIFIED บน Sepolia Etherscan เรียบร้อย 100%", "Contract Address: 0x6C6F482502284B2Ab8fC97bb289109a6E305493D")
    
    evidences = [
        "🟢 เครื่องหมาย Verified ติ๊กถูกสีเขียว (Green Checkmark): ซอร์สโค้ด Solidity ทั้งหมดเปิดเผยโปร่งใสต่อสาธารณะ",
        "🪙 ยอดเหรียญตั้งต้น (Initial Balance): กระเป๋าลูกค้าได้รับแล้ว 185,000 CUP แสดงใน MetaMask ชัดเจน",
        "⚖️ สิทธิ์พนักงานชั่ง (Role Granted): กระเป๋าพนักงาน (0x5faE...4DD1) ได้รับ MINTER_ROLE เรียบร้อยแล้ว",
        "🔗 ความพร้อมใช้งานของระบบ: Web Application (localhost:3000) สื่อสารกับสัญญา Sepolia จริงโดยตรง",
        "🌐 ลิงก์ตรวจสอบสาธารณะ: https://sepolia.etherscan.io/address/0x6C6F482502284B2Ab8fC97bb289109a6E305493D#code"
    ]
    for ev in evidences:
        p = tf_live.add_paragraph()
        p.text = ev
        p.font.size = Pt(16)
        p.font.color.rgb = C_DARK
        p.space_after = Pt(14)

    # ============================================================
    # SLIDE 8: SECURITY & THREAT MITIGATION MATRIX
    # ============================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8, C_BG)
    add_top_nav(s8, "Security Architecture", "การจัดการความปลอดภัยและป้องกันการทุจริต")

    sec_cards = [
        ("🛡️ ป้องกันพนักงานโกง", "Audit Trail + Quota", "ทุกการออกแต้มมีน้ำหนักโลหะและเลขที่ใบเสร็จบันทึกถาวร แอดมินตรวจสอบย้อนหลังได้ตลอดเวลา และกำหนดเพดานโควตาแต้มต่อเดือนได้"),
        ("⚡ ป้องกัน Reentrancy", "OpenZeppelin Standard", "ใช้มาตรฐานสัญญา OpenZeppelin 5.1.0 ที่ไม่มี External Callback Hook ปิดช่องโหว่การโจมตี Drain สัญญาได้ 100%"),
        ("🛑 ป้องกันวิกฤตระบบ", "Emergency Pausable", "หากตรวจพบความผิดปกติหรือสงสัยว่ากุญแจรั่วไหล แอดมินสามารถสั่ง Pause ระงับการทำธุรกรรมทั้งหมดได้ทันที"),
        ("🔐 ป้องกันการขโมยแต้ม", "Self-Custody Design", "ระบบไม่มีฟังก์ชันให้ร้านค้าหักแต้มลูกค้าได้โดยพลการ ลูกค้าต้องเป็นผู้เซ็นคำสั่ง `burnSelf` ด้วยตนเองเท่านั้น")
    ]
    for idx, (s_title, s_sub, s_desc) in enumerate(sec_cards):
        c, tf = add_bento_box(s8, Inches(0.8 + idx * 3.0), Inches(2.2), Inches(2.8), Inches(4.7), s_title, s_sub)
        p = tf.add_paragraph()
        p.text = s_desc
        p.font.size = Pt(14)
        p.font.color.rgb = C_DARK

    # ============================================================
    # SLIDE 9: FUTURE ROADMAP & SCALABILITY
    # ============================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9, C_BG)
    add_top_nav(s9, "Future Scalability", "แผนการพัฒนาต่อยอดสู่อุตสาหกรรมรีไซเคิลจริง")

    roadmaps = [
        ("Phase 1: Gasless DApp (ERC-4337)", "แก้ปัญหาลูกค้าไม่มี SepoliaETH", "ประยุกต์ใช้ Account Abstraction และ Paymaster ให้ร้านค้าเป็นผู้สปอนเซอร์ค่าแก๊สแทนลูกค้า ผู้ขายใช้งานได้ทันทีโดยไม่ต้องถือ ETH"),
        ("Phase 2: IoT Smart Scale Integration", "เชื่อมต่อตาชั่งดิจิทัลอัตโนมัติ", "เชื่อมต่อตาชั่งหน้าลานผ่าน IoT ให้ส่งค่าน้ำหนักจริงเข้า Smart Contract อัตโนมัติ ตัดปัญหาพนักงานพิมพ์น้ำหนักผิดพลาด"),
        ("Phase 3: Layer 2 Rollup Migration", "ลดค่าธรรมเนียมเหลือหลักสตางค์", "ย้ายการประมวลผลขึ้น Arbitrum, Optimism หรือ Base เพื่อรองรับธุรกรรมระดับแสนรายการต่อวันด้วยความเร็วสูง"),
        ("Phase 4: Circular Economy Credit", "ต่อยอดสู่คาร์บอนเครดิต", "นำข้อมูลการรีไซเคิลทองแดงไปคำนวณการลดการปล่อยก๊าซเรือนกระจก (Scope 3 GHG Reduction) เพื่อออกใบรับรอง ESG")
    ]
    for idx, (rm_title, rm_sub, rm_desc) in enumerate(roadmaps):
        card, tf = add_bento_box(s9, Inches(0.8 + idx * 3.0), Inches(2.2), Inches(2.8), Inches(4.7), rm_title, rm_sub)
        p = tf.add_paragraph()
        p.text = rm_desc
        p.font.size = Pt(14)
        p.font.color.rgb = C_DARK

    # ============================================================
    # SLIDE 10: EXECUTIVE SUMMARY & CONCLUSION
    # ============================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10, C_DARK_BG)

    tb_end = s10.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(11.3), Inches(4.5))
    tf_end = tb_end.text_frame
    
    p_e1 = tf_end.paragraphs[0]
    p_e1.text = "COPPERPOINT PROTOCOL"
    p_e1.font.name = FONT_MAIN
    p_e1.font.size = Pt(44)
    p_e1.font.bold = True
    p_e1.font.color.rgb = C_COPPER

    p_e2 = tf_end.add_paragraph()
    p_e2.text = "สรุปผลสัมฤทธิ์ของโครงการ"
    p_e2.font.name = FONT_MAIN
    p_e2.font.size = Pt(26)
    p_e2.font.bold = True
    p_e2.font.color.rgb = C_WHITE
    p_e2.space_before = Pt(8)
    p_e2.space_after = Pt(24)

    conclusions = [
        "✔ แก้ไขปัญหาความไม่โปร่งใสในธุรกิจรีไซเคิลโลหะทองแดงได้สำเร็จด้วยบล็อกเชน",
        "✔ พัฒนาฟังก์ชันพิเศษ 1-Click Direct Burn และ On-Chain Scrap Audit Trail ใช้งานได้จริง",
        "✔ สัญญาได้รับการ Deploy และ Verified ตรวจสอบโค้ดสาธารณะบน Ethereum Sepolia",
        "✔ เว็บแอปพลิเคชันทำงานร่วมกับ MetaMask ได้อย่างราบรื่นทั้ง 3 บทบาท",
        "✔ ขอขอบพระคุณคณะกรรมการและอาจารย์ที่ปรึกษาทุกท่าน — พร้อมเปิดรับคำถาม (Q&A)"
    ]
    for c in conclusions:
        p = tf_end.add_paragraph()
        p.text = c
        p.font.name = FONT_MAIN
        p.font.size = Pt(18)
        p.font.color.rgb = RGBColor(226, 232, 240)
        p.space_after = Pt(12)

    output_path = "/Users/nutchaphonsanitnok/Desktop/งาน/blockchain/COPPERPOINT_MODERN_DECK.pptx"
    prs.save(output_path)
    print(f"Modern Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    create_modern_deck()
