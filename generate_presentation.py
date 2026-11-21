import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 Widescreen layout
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Brand Colors matching sample PDF
    COLOR_BG = RGBColor(255, 255, 255)         # Crisp White
    COLOR_PRIMARY = RGBColor(138, 75, 84)       # Deep Rose / Copper Wine #8A4B54
    COLOR_SECONDARY = RGBColor(178, 94, 70)     # Bronze Copper #B25E46
    COLOR_CARD_BG = RGBColor(253, 246, 245)     # Pale Blush Card Fill #FDF6F5
    COLOR_CARD_BORDER = RGBColor(220, 180, 180) # Soft Rose Border #DCB4B4
    COLOR_DARK = RGBColor(40, 40, 40)           # Dark Charcoal for text
    COLOR_MUTED = RGBColor(110, 110, 110)       # Muted Gray for text
    COLOR_WHITE = RGBColor(255, 255, 255)
    COLOR_TABLE_HEADER = RGBColor(248, 225, 222) # Light Pinkish Header

    FONT_TITLE = "Helvetica"
    FONT_BODY = "Helvetica"

    def add_header_banner(slide, category_text, title_text):
        # Decorative left accent bar
        bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.6), Inches(0.18), Inches(1.3))
        bar.fill.solid()
        bar.fill.fore_color.rgb = COLOR_PRIMARY
        bar.line.fill.background()

        # Category / Subtitle
        if category_text:
            cat_box = slide.shapes.add_textbox(Inches(1.2), Inches(0.55), Inches(10), Inches(0.4))
            tf_cat = cat_box.text_frame
            tf_cat.word_wrap = True
            p_cat = tf_cat.paragraphs[0]
            p_cat.text = category_text.upper()
            p_cat.font.name = FONT_BODY
            p_cat.font.size = Pt(13)
            p_cat.font.bold = True
            p_cat.font.color.rgb = COLOR_SECONDARY

        # Main Slide Title
        title_box = slide.shapes.add_textbox(Inches(1.2), Inches(0.95), Inches(10), Inches(0.8))
        tf = title_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.name = FONT_TITLE
        p.font.size = Pt(28)
        p.font.bold = True
        p.font.color.rgb = COLOR_PRIMARY

        # Decorative Top/Bottom thin line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(2.05), Inches(11.7), Inches(0.02))
        line.fill.solid()
        line.fill.fore_color.rgb = COLOR_CARD_BORDER
        line.line.fill.background()

    def add_card(slide, left, top, width, height, title, content_list, title_color=COLOR_PRIMARY):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_BG
        card.line.color.rgb = COLOR_CARD_BORDER
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.vertical_anchor = MSO_ANCHOR.TOP
        tf.word_wrap = True
        tf.margin_left = Inches(0.35)
        tf.margin_right = Inches(0.35)
        tf.margin_top = Inches(0.3)
        tf.margin_bottom = Inches(0.3)

        if title:
            p_title = tf.paragraphs[0]
            p_title.text = title
            p_title.font.name = FONT_TITLE
            p_title.font.size = Pt(20)
            p_title.font.bold = True
            p_title.font.color.rgb = title_color
            p_title.alignment = PP_ALIGN.CENTER
            p_title.space_after = Pt(14)

        for i, item in enumerate(content_list):
            p = tf.add_paragraph() if (title or i > 0) else tf.paragraphs[0]
            p.text = item
            p.font.name = FONT_BODY
            p.font.size = Pt(15)
            p.font.color.rgb = COLOR_DARK
            p.space_after = Pt(10)
            p.level = 0
            p.alignment = PP_ALIGN.LEFT

    # ==========================================
    # SLIDE 1: COVER
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    
    # Outer frame
    frame = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.6), Inches(0.6), Inches(12.133), Inches(6.3))
    frame.fill.background()
    frame.line.color.rgb = COLOR_PRIMARY
    frame.line.width = Pt(2)

    # University header
    tb_uni = s1.shapes.add_textbox(Inches(1.5), Inches(1.1), Inches(10.33), Inches(0.8))
    tf_uni = tb_uni.text_frame
    p_uni1 = tf_uni.paragraphs[0]
    p_uni1.text = "RAMKHAMHAENG UNIVERSITY"
    p_uni1.font.name = FONT_TITLE
    p_uni1.font.size = Pt(18)
    p_uni1.font.bold = True
    p_uni1.font.color.rgb = COLOR_PRIMARY
    p_uni1.alignment = PP_ALIGN.CENTER

    p_uni2 = tf_uni.add_paragraph()
    p_uni2.text = "Department of Computer Engineering"
    p_uni2.font.name = FONT_BODY
    p_uni2.font.size = Pt(14)
    p_uni2.font.color.rgb = COLOR_MUTED
    p_uni2.alignment = PP_ALIGN.CENTER

    # Project Title
    tb_title = s1.shapes.add_textbox(Inches(1.5), Inches(2.3), Inches(10.33), Inches(2.0))
    tf_title = tb_title.text_frame
    p_t1 = tf_title.paragraphs[0]
    p_t1.text = "COPPERPOINT"
    p_t1.font.name = FONT_TITLE
    p_t1.font.size = Pt(56)
    p_t1.font.bold = True
    p_t1.font.color.rgb = COLOR_PRIMARY
    p_t1.alignment = PP_ALIGN.CENTER

    p_t2 = tf_title.add_paragraph()
    p_t2.text = "ระบบแต้มสะสมและติดตามขยะรีไซเคิลโลหะทองแดงบนบล็อกเชน"
    p_t2.font.name = FONT_BODY
    p_t2.font.size = Pt(22)
    p_t2.font.bold = True
    p_t2.font.color.rgb = COLOR_SECONDARY
    p_t2.alignment = PP_ALIGN.CENTER
    p_t2.space_before = Pt(10)

    # Footer Presenters
    tb_pres = s1.shapes.add_textbox(Inches(1.2), Inches(5.0), Inches(5.0), Inches(1.5))
    tf_pres = tb_pres.text_frame
    p_p1 = tf_pres.paragraphs[0]
    p_p1.text = "Presented by"
    p_p1.font.bold = True
    p_p1.font.size = Pt(15)
    p_p1.font.color.rgb = COLOR_PRIMARY
    p_p1.alignment = PP_ALIGN.CENTER

    p_p2 = tf_pres.add_paragraph()
    p_p2.text = "นาย [ชื่อ-นามสกุล นักศึกษา 1] รหัส [XXXXXXXXXX]\nนาย/นางสาว [ชื่อ-นามสกุล นักศึกษา 2] รหัส [XXXXXXXXXX]"
    p_p2.font.size = Pt(14)
    p_p2.font.color.rgb = COLOR_DARK
    p_p2.alignment = PP_ALIGN.CENTER
    p_p2.space_before = Pt(6)

    tb_lect = s1.shapes.add_textbox(Inches(7.1), Inches(5.0), Inches(5.0), Inches(1.5))
    tf_lect = tb_lect.text_frame
    p_l1 = tf_lect.paragraphs[0]
    p_l1.text = "Lecturer"
    p_l1.font.bold = True
    p_l1.font.size = Pt(15)
    p_l1.font.color.rgb = COLOR_PRIMARY
    p_l1.alignment = PP_ALIGN.CENTER

    p_l2 = tf_lect.add_paragraph()
    p_l2.text = "อ.พิชัย สุวรรณลอยล่อง"
    p_l2.font.size = Pt(16)
    p_l2.font.bold = True
    p_l2.font.color.rgb = COLOR_DARK
    p_l2.alignment = PP_ALIGN.CENTER
    p_l2.space_before = Pt(10)

    # ==========================================
    # SLIDE 2: PROBLEM & BACKGROUND
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    add_header_banner(s2, "Problem & Background", "ที่มาและความสำคัญของปัญหา")
    add_card(s2, Inches(0.8), Inches(2.3), Inches(5.6), Inches(4.7), "ที่มา (Background)", [
        "1. ธุรกิจรับซื้อของเก่าและรีไซเคิลโลหะทองแดงมีมูลค่าสูง มีหลายเกรด เช่น ทองแดงปอกสวย, ท่อแอร์, สายไฟ, ทองเหลือง",
        "2. ร้านรับซื้อของเก่าส่วนใหญ่บันทึกด้วยสมุดจดหรือโปรแกรมบัญชีแบบรวมศูนย์ ลูกค้าประจำไม่มีแรงจูงใจสะสมแต้ม",
        "3. อุตสาหกรรมรีไซเคิลและ Circular Economy ในปัจจุบันต้องการหลักฐานความโปร่งใสของแหล่งที่มาของโลหะ (Traceability)"
    ])
    add_card(s2, Inches(6.9), Inches(2.3), Inches(5.6), Inches(4.7), "ปัญหา (Problems)", [
        "1. ตรวจสอบย้อนหลังยาก ข้อมูลเก็บในฐานข้อมูลกลางที่ผู้ดูแลสามารถแก้ไขหรือลบย้อนหลังได้โดยไม่มีใครรู้",
        "2. ขาดความโปร่งใสในน้ำหนักและเกรดโลหะ ลูกค้าไม่สามารถตรวจสอบประวัติการขายของตนเองได้",
        "3. ไม่สามารถถือแต้มในกระเป๋าตัวเอง (Self-Custody) ได้ หากร้านปิดหรือระบบล่ม แต้มจะสูญหายทันที",
        "4. การโกงน้ำหนักและสวมสิทธิ์แต้ม ไม่มีลายเซ็นดิจิทัล (Cryptographic Signature) ยืนยันธุรกรรม"
    ])

    # ==========================================
    # SLIDE 3: CONCEPT
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    add_header_banner(s3, "Concept", "แนวคิดหลักของโครงการ (Core Concept)")

    card3 = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(2.6), Inches(10.9), Inches(4.0))
    card3.fill.solid()
    card3.fill.fore_color.rgb = COLOR_CARD_BG
    card3.line.color.rgb = COLOR_PRIMARY
    card3.line.width = Pt(2)
    tf3 = card3.text_frame
    tf3.vertical_anchor = MSO_ANCHOR.MIDDLE
    tf3.word_wrap = True
    tf3.margin_left = Inches(0.8)
    tf3.margin_right = Inches(0.8)

    p3 = tf3.paragraphs[0]
    p3.text = "CopperPoint (CUP)"
    p3.font.name = FONT_TITLE
    p3.font.size = Pt(36)
    p3.font.bold = True
    p3.font.color.rgb = COLOR_PRIMARY
    p3.alignment = PP_ALIGN.CENTER
    p3.space_after = Pt(20)

    p3_body = tf3.add_paragraph()
    p3_body.text = (
        "คือแต้มสะสมดิจิทัลมาตรฐาน ERC-20 บนบล็อกเชน Ethereum\n"
        "ที่ออกโดยพนักงานชั่งเมื่อรับซื้อเศษทองแดงและขยะรีไซเคิล\n"
        "พร้อมบันทึก เกรดโลหะ, น้ำหนัก (กรัม) และเลขที่ใบเสร็จ ลงบน On-Chain Audit Trail\n"
        "ผู้ขายสามารถถือแต้มใน MetaMask ของตนเอง แลกเงินสดหรือของรางวัลด้วยการเผาเหรียญ (Burn)\n"
        "โดยทุกธุรกรรมโปร่งใส ตรวจสอบได้สาธารณะผ่าน Etherscan ทั่วโลก"
    )
    p3_body.font.name = FONT_BODY
    p3_body.font.size = Pt(20)
    p3_body.font.color.rgb = COLOR_DARK
    p3_body.alignment = PP_ALIGN.CENTER

    # ==========================================
    # SLIDE 4: WHY BLOCKCHAIN
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    add_header_banner(s4, "Why Blockchain", "ทำไมต้องใช้บล็อกเชน (Comparison)")

    table_shape4 = s4.shapes.add_table(4, 2, Inches(1.2), Inches(2.5), Inches(10.9), Inches(4.3))
    table4 = table_shape4.table
    table4.columns[0].width = Inches(5.45)
    table4.columns[1].width = Inches(5.45)

    headers4 = ["ฐานข้อมูลแบบรวมศูนย์ (Database ทั่วไป)", "บล็อกเชน (CopperPoint On-Chain)"]
    for j, h in enumerate(headers4):
        cell = table4.cell(0, j)
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_TABLE_HEADER
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.bold = True
        p.font.size = Pt(18)
        p.font.color.rgb = COLOR_PRIMARY
        p.alignment = PP_ALIGN.CENTER

    rows4 = [
        ("ผู้ดูแลระบบ (Admin) สามารถแก้ไขหรือลบประวัติย้อนหลังได้", "ข้อมูลถูกบันทึกแบบถาวร (Immutable) แก้ไขย้อนหลังไม่ได้"),
        ("ตรวจสอบประวัติได้เฉพาะพนักงานหรือผู้มีสิทธิ์ในบริษัท", "ทุกคนและลูกค้าสามารถตรวจสอบได้สาธารณะ 100% ผ่าน Etherscan"),
        ("กฎระเบียบและสิทธิ์ขึ้นอยู่กับนโยบายของร้านหรือเอกสารกระดาษ", "กติกาทุกอย่างถูกบังคับใช้อัตโนมัติด้วย Smart Contract (Code is Law)")
    ]
    for i, (col1, col2) in enumerate(rows4):
        c1 = table4.cell(i+1, 0)
        c2 = table4.cell(i+1, 1)
        c1.fill.solid()
        c1.fill.fore_color.rgb = COLOR_WHITE if i % 2 == 0 else COLOR_CARD_BG
        c2.fill.solid()
        c2.fill.fore_color.rgb = COLOR_WHITE if i % 2 == 0 else COLOR_CARD_BG

        p1 = c1.text_frame.paragraphs[0]
        p1.text = col1
        p1.font.size = Pt(16)
        p1.font.color.rgb = COLOR_DARK

        p2 = c2.text_frame.paragraphs[0]
        p2.text = col2
        p2.font.size = Pt(16)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_SECONDARY

    # ==========================================
    # SLIDE 5: OBJECTIVE
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    add_header_banner(s5, "Objectives", "วัตถุประสงค์ของโครงการ (4 ด้าน)")

    objs = [
        ("ข้อที่ 1: Smart Contract", "พัฒนาสัญญาอัจฉริยะมาตรฐาน ERC-20 ด้วย OpenZeppelin 5.1.0 ที่รองรับฟังก์ชัน Mint บันทึกเกรด/น้ำหนัก และฟังก์ชัน Burn เพื่อแลกรางวัล"),
        ("ข้อที่ 2: ควบคุมสิทธิ์ (RBAC)", "ควบคุมสิทธิ์ด้วย AccessControl แยกสิทธิ์ Admin, พนักงานชั่ง (Minter) และลูกค้า พร้อมกลไก Pausable หยุดระบบฉุกเฉิน"),
        ("ข้อที่ 3: พัฒนา Web Application", "พัฒนาเว็บแอปเชื่อมต่อ MetaMask ด้วย ethers.js v6 รองรับการคำนวณราคาและแต้มอัตโนมัติตามฐานข้อมูลเศษทองแดง 46 รายการ"),
        ("ข้อที่ 4: ทดสอบ & Deploy จริง", "ทดสอบความถูกต้องของระบบด้วย 21 Unit Tests (100% Pass) และ Deploy ขึ้นสู่เครือข่าย Ethereum Sepolia Testnet พร้อม Verified")
    ]
    col_w = Inches(2.7)
    gap = Inches(0.25)
    for idx, (title_o, desc_o) in enumerate(objs):
        x = Inches(0.8) + idx * (col_w + gap)
        add_card(s5, x, Inches(2.5), col_w, Inches(4.3), title_o, [desc_o])

    # ==========================================
    # SLIDE 6: SCOPE & BENEFITS
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    add_header_banner(s6, "Scope & Benefits", "ขอบเขตและประโยชน์ที่คาดว่าจะได้รับ")
    add_card(s6, Inches(0.8), Inches(2.3), Inches(5.6), Inches(4.7), "ขอบเขตของโครงการ (Scope)", [
        "• แคตตาล็อกเศษโลหะและทองแดง 46 รายการ แบ่ง 6 หมวดหมู่",
        "• การบันทึก On-Chain Metadata: ประเภทขยะ, น้ำหนัก (กรัม), เลขที่ใบเสร็จ",
        "• การแลกรางวัลแบบ 1-Click Direct Burn โดยไม่ต้อง Approve 2 ขั้นตอน",
        "• รองรับกระเป๋าเงิน Web3 (MetaMask) เครือข่าย Ethereum Sepolia",
        "• การตรวจสอบ Audit Trail แบบสาธารณะและลิงก์ไปยัง Etherscan"
    ])
    add_card(s6, Inches(6.9), Inches(2.3), Inches(5.6), Inches(4.7), "ประโยชน์ที่คาดว่าจะได้รับ (Benefits)", [
        "• ประวัติการรับซื้อและออกแต้มโปร่งใส ตรวจสอบย้อนหลังได้ 100%",
        "• ป้องกันการแก้ไขหรือปลอมแปลงข้อมูลน้ำหนักและแต้มสะสม",
        "• สร้างแรงจูงใจและความภักดีของลูกค้าขาประจำ (Customer Loyalty)",
        "• ข้อมูลเชื่อมโยงกับบล็อกเชน เพิ่มมูลค่าในห่วงโซ่เศรษฐกิจหมุนเวียน",
        "• เป็นต้นแบบระบบการติดตามของเสียรีไซเคิลด้วยบล็อกเชนระดับอุตสาหกรรม"
    ])

    # ==========================================
    # SLIDE 7: USERS & PERMISSIONS
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    add_header_banner(s7, "Users & Permissions", "บทบาทและสิทธิ์การใช้งาน (Role-Based Access Control)")

    tbl7_shape = s7.shapes.add_table(4, 4, Inches(0.8), Inches(2.4), Inches(11.7), Inches(4.5))
    tbl7 = tbl7_shape.table
    tbl7.columns[0].width = Inches(2.5)
    tbl7.columns[1].width = Inches(2.2)
    tbl7.columns[2].width = Inches(3.8)
    tbl7.columns[3].width = Inches(3.2)

    headers7 = ["บทบาท (Role)", "ผู้ถือครอง", "สิ่งที่ทำได้ (Allowed)", "สิ่งที่ทำไม่ได้ (Forbidden)"]
    for j, h in enumerate(headers7):
        cell = tbl7.cell(0, j)
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_TABLE_HEADER
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.bold = True
        p.font.size = Pt(16)
        p.font.color.rgb = COLOR_PRIMARY
        p.alignment = PP_ALIGN.CENTER

    data7 = [
        ("Admin\n(DEFAULT_ADMIN_ROLE)", "เจ้าของร้าน / ผู้ดูแลระบบ", "• ให้และถอนสิทธิ์ MINTER_ROLE\n• สั่งหยุดระบบฉุกเฉิน (Pause)\n• ดูสรุปยอดกำไรและภาพรวมระบบ", "• ไม่สามารถ Mint แต้มได้\n(หากไม่มอบสิทธิ์ Minter ให้ตัวเอง)"),
        ("พนักงานชั่ง\n(MINTER_ROLE)", "พนักงานหน้าลานรับซื้อ", "• บันทึกรับซื้อทองแดง 46 รายการ\n• คำนวณเงินและออกแต้ม CUP\n• บันทึกน้ำหนักและเลขที่ใบเสร็จ", "• ไม่สามารถตั้งสิทธิ์ให้ผู้อื่นได้\n• ไม่สามารถสั่งถอนสิทธิ์หรือ Pause ได้"),
        ("ลูกค้า / ผู้ขาย\n(Customer)", "บุคคลทั่วไป / ร้านค้าย่อย", "• ถือแต้มในกระเป๋า MetaMask\n• แลกเงินสดหรือของรางวัล (Burn)\n• ตรวจสอบประวัติของตนเอง", "• ไม่สามารถสร้างเหรียญ (Mint) เองได้\n• ไม่สามารถแก้ไขประวัติได้")
    ]
    for i, row in enumerate(data7):
        for j, val in enumerate(row):
            c = tbl7.cell(i+1, j)
            c.fill.solid()
            c.fill.fore_color.rgb = COLOR_WHITE if i % 2 == 0 else COLOR_CARD_BG
            p = c.text_frame.paragraphs[0]
            p.text = val
            p.font.size = Pt(13)
            p.font.color.rgb = COLOR_DARK
            if j == 0:
                p.font.bold = True
                p.font.color.rgb = COLOR_PRIMARY

    # ==========================================
    # SLIDE 8: ARCHITECTURE
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    add_header_banner(s8, "System Architecture", "สถาปัตยกรรมระบบ (System Architecture)")

    # 3 Layers
    add_card(s8, Inches(0.8), Inches(2.4), Inches(3.6), Inches(4.5), "1. User Layer", [
        "👥 ผู้ใช้งานระบบ 3 บทบาท:",
        "",
        "• ผู้ขาย / ลูกค้า (Customer)",
        "• พนักงานชั่ง (Staff Minter)",
        "• เจ้าของร้าน / แอดมิน (Admin)",
        "",
        "📱 ใช้งานผ่าน Web Browser บนคอมพิวเตอร์และมือถือ",
        "🔑 ลงนามธุรกรรมด้วย MetaMask"
    ])
    add_card(s8, Inches(4.8), Inches(2.4), Inches(3.7), Inches(4.5), "2. Application Layer", [
        "💻 Web Application:",
        "",
        "• React 18 + Vite (High Performance)",
        "• Tailwind CSS (Responsive Design)",
        "• ethers.js v6 (Web3 Provider & Signer)",
        "• 46 Scrap Metal Catalog Engine",
        "• IPFS Hash Receipt Generator",
        "• Audit Trail Explorer UI"
    ])
    add_card(s8, Inches(8.9), Inches(2.4), Inches(3.6), Inches(4.5), "3. Blockchain Layer", [
        "⛓️ Smart Contract & Network:",
        "",
        "• CopperPoint.sol (Solidity 0.8.24)",
        "• OpenZeppelin ERC-20 + AccessControl",
        "• เครือข่าย Ethereum Sepolia Testnet",
        "• Chain ID: 11155111",
        "• Public Audit บน Sepolia Etherscan",
        "• Verified Green Checkmark"
    ])

    # ==========================================
    # SLIDE 9: WORKFLOW
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    add_header_banner(s9, "Workflow", "ขั้นตอนการทำงานของระบบ (Process Flow)")

    steps9 = [
        ("ขั้นตอนที่ 1", "ลูกค้านำทองแดงมาชั่ง", "ลูกค้านำเศษทองแดงหรือสายไฟมา พนักงานเลือกประเภทจาก 46 รายการ และระบุน้ำหนักที่ชั่งได้จริง"),
        ("ขั้นตอนที่ 2", "บันทึกและออกแต้ม", "พนักงานกดยืนยัน ระบบเรียกฟังก์ชัน `mintWithScrapDetails` พร้อมบันทึกเกรด น้ำหนัก และเลขที่ใบเสร็จลงบล็อกเชน"),
        ("ขั้นตอนที่ 3", "แต้มเข้ากระเป๋า", "เหรียญแต้ม CUP ถูกโอนเข้ากระเป๋า MetaMask ของลูกค้าโดยตรง พร้อมบันทึก Event `ScrapTraded` สาธารณะ"),
        ("ขั้นตอนที่ 4", "แลกเงินสดหรือรางวัล", "ลูกค้าเลือกแลกเงินสด (Cashback) หรือของรางวัล โดยกดปุ่ม 1-Click ระบบเรียก `burnSelf` เผาเหรียญทิ้งทันที")
    ]
    for idx, (st_num, st_title, st_desc) in enumerate(steps9):
        x = Inches(0.8) + idx * (Inches(2.7) + Inches(0.25))
        add_card(s9, x, Inches(2.5), Inches(2.7), Inches(4.3), st_num, [f"📌 {st_title}\n\n{st_desc}"])

    # ==========================================
    # SLIDE 10: TESTING
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    add_header_banner(s10, "Testing & Quality Assurance", "ผลการทดสอบ Smart Contract (21 Test Cases)")

    add_card(s10, Inches(0.8), Inches(2.4), Inches(5.6), Inches(4.5), "ผลการทดสอบ Hardhat (Unit Tests)", [
        "✅ 21 passing (100% Core Passing Rate)",
        "",
        "• Deployment & Initialize: กำหนดชื่อ, สัญลักษณ์ CUP และมอบสิทธิ์แอดมินเริ่มต้นถูกต้อง",
        "• Mint & Scrap Audit: ตรวจสอบเฉพาะ MINTER_ROLE ที่ออกแต้มได้ พร้อม Event ครบถ้วน",
        "• Direct Burn (burnSelf): ลูกค้าสามารถเผาเหรียญของตนเองเพื่อแลกรางวัลได้โดยตรง",
        "• Role Enforcement: บัญชีที่ไม่มีสิทธิ์ถูกปฏิเสธ (Reverted) ทุกกรณี",
        "• Pausable Protection: เมื่อแอดมินสั่ง Pause ฟังก์ชัน Mint และ Burn จะถูกระงับทันที"
    ])
    add_card(s10, Inches(6.9), Inches(2.4), Inches(5.6), Inches(4.5), "การทดสอบบนเครือข่ายจริง (Sepolia)", [
        "🌐 Deployment บน Ethereum Sepolia สำเร็จ:",
        "",
        "• Contract Address: 0x6C6F482502284B2Ab8fC97bb289109a6E305493D",
        "• ผ่านการ Compile ด้วย solc 0.8.24 + Optimization 200 runs",
        "• ทดสอบเชื่อมต่อกระเป๋า MetaMask จริง 3 บัญชี (Admin, Staff, Customer)",
        "• ทำรายการรับซื้อทองแดงจริงและยืนยันบล็อกสำเร็จ",
        "• บันทึกธุรกรรมและยอดคงเหลือแสดงตรงกันทั้งบน Web App, MetaMask และ Etherscan"
    ])

    # ==========================================
    # SLIDE 11: SECURITY & THREAT MODEL
    # ==========================================
    s11 = prs.slides.add_slide(blank_layout)
    add_header_banner(s11, "Security & Threat Model", "การวิเคราะห์ความเสี่ยงและมาตรการป้องกันความปลอดภัย")

    tbl11_shape = s11.shapes.add_table(5, 2, Inches(1.0), Inches(2.4), Inches(11.3), Inches(4.5))
    tbl11 = tbl11_shape.table
    tbl11.columns[0].width = Inches(4.5)
    tbl11.columns[1].width = Inches(6.8)

    h11 = ["ภัยคุกคาม / ความเสี่ยง (Threat)", "มาตรการป้องกันในระบบ CopperPoint (Mitigation)"]
    for j, h in enumerate(h11):
        cell = tbl11.cell(0, j)
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_TABLE_HEADER
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.bold = True
        p.font.size = Pt(16)
        p.font.color.rgb = COLOR_PRIMARY
        p.alignment = PP_ALIGN.CENTER

    data11 = [
        ("พนักงานชั่งทุจริตออกแต้มโดยไม่มีการรับซื้อจริง", "ทุกการออกแต้มต้องระบุเกรดและน้ำหนัก ซึ่งจะถูกบันทึกเป็น Event สาธารณะ แอดมินสามารถตรวจสอบและถอนสิทธิ์ได้ทันที"),
        ("การโจมตี Reentrancy Attack", "ฟังก์ชันในสัญญาไม่มีการส่งคำสั่ง Callback หรือ External Call ไปยังสัญญานิรนาม ใช้มาตรฐาน OpenZeppelin ที่ปลอดภัยสูง"),
        ("การสวมสิทธิ์หรือขโมยแต้มของลูกค้า", "ลูกค้าเป็นผู้ถือ Private Key ใน MetaMask เอง ร้านค้าไม่สามารถดึงแต้มออกได้โดยพลการ (Self-Custody)"),
        ("เกิดข้อผิดพลาดหรือตรวจพบความผิดปกติในระบบ", "มีระบบ Pausable ฉุกเฉิน แอดมินสามารถสั่งระงับการทำงานทั้งระบบได้ชั่วคราวด้วยคำสั่ง `setPaused(true)`")
    ]
    for i, (col1, col2) in enumerate(data11):
        c1 = tbl11.cell(i+1, 0)
        c2 = tbl11.cell(i+1, 1)
        c1.fill.solid()
        c1.fill.fore_color.rgb = COLOR_WHITE if i % 2 == 0 else COLOR_CARD_BG
        c2.fill.solid()
        c2.fill.fore_color.rgb = COLOR_WHITE if i % 2 == 0 else COLOR_CARD_BG

        p1 = c1.text_frame.paragraphs[0]
        p1.text = col1
        p1.font.bold = True
        p1.font.size = Pt(14)
        p1.font.color.rgb = COLOR_DARK

        p2 = c2.text_frame.paragraphs[0]
        p2.text = col2
        p2.font.size = Pt(14)
        p2.font.color.rgb = COLOR_SECONDARY

    # ==========================================
    # SLIDE 12: TRY IT / CONTRACT INFO
    # ==========================================
    s12 = prs.slides.add_slide(blank_layout)
    add_header_banner(s12, "Live Deployment", "ข้อมูลสัญญาจริงบน Sepolia Testnet")

    card12 = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(2.4), Inches(10.9), Inches(4.5))
    card12.fill.solid()
    card12.fill.fore_color.rgb = COLOR_CARD_BG
    card12.line.color.rgb = COLOR_PRIMARY
    card12.line.width = Pt(2)
    tf12 = card12.text_frame
    tf12.word_wrap = True
    tf12.margin_left = Inches(0.6)
    tf12.margin_right = Inches(0.6)
    tf12.margin_top = Inches(0.4)

    p12_h = tf12.paragraphs[0]
    p12_h.text = "🌐 ข้อมูลสัญญาและการเข้าใช้งานระบบจริง"
    p12_h.font.name = FONT_TITLE
    p12_h.font.size = Pt(24)
    p12_h.font.bold = True
    p12_h.font.color.rgb = COLOR_PRIMARY
    p12_h.space_after = Pt(15)

    items12 = [
        "• Network: Ethereum Sepolia Testnet (Chain ID: 11155111)",
        "• Token Name / Symbol: CopperPoint (CUP) • Decimals: 18",
        "• Smart Contract Address: 0x6C6F482502284B2Ab8fC97bb289109a6E305493D",
        "• Etherscan Verified: ตรวจสอบและผ่านการรับรองแล้ว (มีเครื่องหมายถูกสีเขียว)",
        "• Etherscan URL: https://sepolia.etherscan.io/address/0x6C6F482502284B2Ab8fC97bb289109a6E305493D",
        "• Web Application: http://localhost:3000/ (Vite Dev Server)",
        "• Current Customer Balance: 185,000 CUP (พร้อมทดสอบการแลกรางวัล)"
    ]
    for it in items12:
        p = tf12.add_paragraph()
        p.text = it
        p.font.name = FONT_BODY
        p.font.size = Pt(15)
        p.font.color.rgb = COLOR_DARK
        p.space_after = Pt(8)

    # ==========================================
    # SLIDE 13: UI DEMO - STAFF (MINTER)
    # ==========================================
    s13 = prs.slides.add_slide(blank_layout)
    add_header_banner(s13, "System Interface", "หน้าจอระบบ: พนักงานชั่ง & ออกแต้ม (Staff / Minter)")
    add_card(s13, Inches(0.8), Inches(2.4), Inches(5.6), Inches(4.5), "ฟังก์ชันพนักงานชั่ง", [
        "1. แคตตาล็อกทองแดงและสายไฟ 46 รายการ:",
        "   เลือกเกรดโลหะได้อย่างรวดเร็ว เช่น ทองแดงปอกสวย, ท่อแอร์, ทองแดงเผาไฟ, สายไฟ VAF",
        "",
        "2. คำนวณราคาและแต้มอัตโนมัติ:",
        "   ระบุน้ำหนักที่ชั่งได้จริง ระบบจะคำนวณเงินที่ต้องจ่ายและแต้ม CUP ที่ลูกค้าจะได้รับทันที (เรต 20 บาท = 1 CUP)",
        "",
        "3. สั่ง Mint ขึ้นบล็อกเชน:",
        "   กดปุ่ม 'ชั่งโลหะ & บันทึกขึ้นบล็อกเชน' ลงนามผ่าน MetaMask เพื่อส่งธุรกรรมขึ้นสู่ Sepolia โดยตรง"
    ])
    add_card(s13, Inches(6.9), Inches(2.4), Inches(5.6), Inches(4.5), "จุดเด่นและหลักฐาน On-Chain", [
        "• บันทึกเลขที่ใบเสร็จ (Receipt Number) อัตโนมัติ",
        "• ฝังรหัสจำลอง IPFS Hash สำหรับแนบรูปถ่ายตาชั่ง",
        "• ป้องกันการออกแต้มมั่วด้วยระบบ Role-Based",
        "• แสดงยอดคงเหลือของลูกค้าปลายทางแบบเรียลไทม์",
        "",
        "💡 พนักงานหน้าลานทำงานสะดวกผ่านแท็บเล็ตหรือคอมพิวเตอร์"
    ])

    # ==========================================
    # SLIDE 14: UI DEMO - CUSTOMER (PRICE & BALANCE)
    # ==========================================
    s14 = prs.slides.add_slide(blank_layout)
    add_header_banner(s14, "System Interface", "หน้าจอระบบ: ผู้ขาย / ตรวจสอบแต้ม & ใบราคา (Customer)")
    add_card(s14, Inches(0.8), Inches(2.4), Inches(5.6), Inches(4.5), "การดูแต้มสะสม & ราคารับซื้อ", [
        "1. บัตรสมาชิกดิจิทัล (Digital Card):",
        "   แสดงยอดแต้มสะสมคงเหลือ (185,000 CUP) พร้อมแสดงมูลค่าเงินสดเทียบเท่า (185,000 บาท)",
        "",
        "2. ใบราคาเศษโลหะประจำวัน 46 รายการ:",
        "   ลูกค้าสามารถเช็คราคารับซื้อทองแดงและสายไฟได้แบบเรียลไทม์ แบ่งหมวดหมู่ชัดเจน",
        "",
        "3. ปุ่มลัด 'โอนเข้ากระเป๋าฉัน':",
        "   เพียงคลิกเดียว Address ของผู้ขายจะถูกกรอกลงในระบบชั่งน้ำหนักทันที ไม่ต้องพิมพ์เลขกระเป๋าเอง"
    ])
    add_card(s14, Inches(6.9), Inches(2.4), Inches(5.6), Inches(4.5), "ความโปร่งใสที่ผู้ขายได้รับ", [
        "• ไม่ต้องกลัวแต้มหายหรือถูกโกง ยอดเงินผูกกับกระเป๋า MetaMask ส่วนตัว",
        "• สามารถกดดูรายการโอนเหรียญใน MetaMask หรือดูบน Etherscan ได้ทันที",
        "• มีระบบแจ้งเตือนราคาโลหะขึ้น-ลง เพื่อช่วยให้ผู้ขายวางแผนนำเศษโลหะมาขายได้คุ้มค่าที่สุด"
    ])

    # ==========================================
    # SLIDE 15: UI DEMO - CUSTOMER (REDEEM)
    # ==========================================
    s15 = prs.slides.add_slide(blank_layout)
    add_header_banner(s15, "System Interface", "หน้าจอระบบ: 1-Click เผาแต้มแลกรางวัล (Direct Burn)")
    add_card(s15, Inches(0.8), Inches(2.4), Inches(5.6), Inches(4.5), "กลไก 1-Click Direct Burn", [
        "1. เลือกรีเบตเงินสด (Cashback):",
        "   แลกเงินสดคืน 50 บาท, 100 บาท, 500 บาท หรือ 1,000 บาท เข้ากระเป๋า",
        "",
        "2. เลือกแลกของรางวัลพรีเมียม:",
        "   • ถุงมือช่างทนความร้อน (250 CUP)",
        "   • ข้าวสารหอมมะลิ 5 กก. (500 CUP)",
        "   • คูปองน้ำมัน PTT 1,000 บาท (1,000 CUP)",
        "   • ทองคำแท่ง 1 สลึง (12,000 CUP)",
        "",
        "3. กดปุ่ม 'แลกทันที' กดยืนยันใน MetaMask ครั้งเดียว เหรียญจะถูกเผาทิ้ง (Burn) โดยไม่ต้อง Approve"
    ])
    add_card(s15, Inches(6.9), Inches(2.4), Inches(5.6), Inches(4.5), "ประโยชน์เชิงความปลอดภัย", [
        "• แก้ปัญหาความซ้ำซ้อนของการ Approve 2 ขั้นตอนในระบบเดิม",
        "• เหรียญถูกเผาออกจาก Supply ในบล็อกเชนจริง ทำให้ยอด Total Supply ลดลงอย่างโปร่งใส",
        "• มี Event `RewardRedeemed` บันทึกลงบล็อกเชนเป็นหลักฐานว่าผู้ขายแลกของรางวัลอะไรไป เมื่อใด"
    ])

    # ==========================================
    # SLIDE 16: UI DEMO - ADMIN DASHBOARD
    # ==========================================
    s16 = prs.slides.add_slide(blank_layout)
    add_header_banner(s16, "System Interface", "หน้าจอระบบ: ผู้ดูแล & สรุปภาพรวมกำไร (Admin)")
    add_card(s16, Inches(0.8), Inches(2.4), Inches(5.6), Inches(4.5), "ฟังก์ชันเจ้าของกิจการ (Admin)", [
        "1. สรุปผลประกอบการ & กำไรส่วนต่าง:",
        "   แสดงยอดรวมรับซื้อเศษทองแดง ยอดขายส่งโรงหลอม และกำไรส่วนต่างสุทธิ (Gross Profit) แบบอัตโนมัติ",
        "",
        "2. สถิติหมุนเวียนเหรียญแต้ม:",
        "   ติดตามยอดเหรียญ CUP ที่แจกออกไปทั้งหมด (Total Minted) และยอดเหรียญที่ถูกเผาทำลายจากการแลกรางวัล (Total Burned)",
        "",
        "3. สวิตช์หยุดระบบฉุกเฉิน (Emergency Pause):",
        "   สามารถกดหยุดการทำธุรกรรมของสัญญาได้ทันทีหากพบเหตุผิดปกติ"
    ])
    add_card(s16, Inches(6.9), Inches(2.4), Inches(5.6), Inches(4.5), "การบริหารจัดการสิทธิ์", [
        "• จัดการสิทธิ์พนักงานชั่ง (Grant / Revoke MINTER_ROLE)",
        "• เพิ่มหรือปลดพนักงานหน้าลานได้ตลอดเวลาผ่าน Smart Contract",
        "• ไม่จำเป็นต้องเขียนโค้ดเพิ่ม ทำงานผ่านปุ่มบนหน้าเว็บแดชบอร์ดได้ทันที"
    ])

    # ==========================================
    # SLIDE 17: ETHERSCAN AUDIT TRAIL
    # ==========================================
    s17 = prs.slides.add_slide(blank_layout)
    add_header_banner(s17, "Public Verification", "หลักฐานความโปร่งใสบน Sepolia Etherscan")
    add_card(s17, Inches(0.8), Inches(2.4), Inches(5.6), Inches(4.5), "หลักฐานที่ปรากฏบนบล็อกเชน", [
        "1. Verified Contract Code ✅:",
        "   Smart Contract ผ่านการยืนยันซอร์สโค้ดเรียบร้อยแล้ว แสดงโค้ด Solidity ทั้งหมดต่อสาธารณะ",
        "",
        "2. บันทึกธุรกรรม (Transactions):",
        "   มีประวัติการเรียกฟังก์ชัน `grantRole`, `mintWithScrapDetails`, และ `burnSelf` ชัดเจน",
        "",
        "3. การโอนเหรียญ (Token Transfers):",
        "   แสดงการเคลื่อนไหวของเหรียญ CUP ทุกครั้งที่มีการแจกแต้มหรือเผาแต้ม"
    ])
    add_card(s17, Inches(6.9), Inches(2.4), Inches(5.6), Inches(4.5), "การตรวจสอบโดยผู้ประเมินภายนอก", [
        "• อาจารย์และผู้ประเมินสามารถคลิกลิงก์ Etherscan เพื่อดูธุรกรรมสดได้ตลอด 24 ชั่วโมง",
        "• ทุกบล็อกบันทึกเวลา (Timestamp), Gas Fee และ Wallet Address ของผู้ทำรายการอย่างแม่นยำ",
        "• ไม่สามารถปลอมแปลงประวัติหรือสร้างข้อมูลเท็จได้"
    ])

    # ==========================================
    # SLIDE 18: LIMITATIONS & FUTURE WORK
    # ==========================================
    s18 = prs.slides.add_slide(blank_layout)
    add_header_banner(s18, "Limitations & Future Work", "ข้อจำกัดของระบบและแนวทางการพัฒนาต่อยอด")
    add_card(s18, Inches(0.8), Inches(2.4), Inches(5.6), Inches(4.5), "ข้อจำกัดในปัจจุบัน (Limitations)", [
        "• ผู้ใช้งานยังต้องมี SepoliaETH เล็กน้อยสำหรับจ่ายค่า Gas เมื่อทำรายการ",
        "• การดึงประวัติ Audit Trail ยังดึงข้อมูลตรงจาก RPC Node สาธารณะ หากข้อมูลมีปริมาณมากอาจต้องรอการโหลด",
        "• กุญแจแอดมินยังเป็นบัญชีเดี่ยว (Single Private Key) ซึ่งควรยกระดับเป็น Multi-Signature สำหรับระดับองค์กร",
        "• ระบบยังทำงานอยู่บนเครือข่ายทดสอบ (Sepolia Testnet)"
    ])
    add_card(s18, Inches(6.9), Inches(2.4), Inches(5.6), Inches(4.5), "แนวทางพัฒนาต่อยอด (Future Work)", [
        "• ธุรกรรมไร้ค่าแก๊ส (Gasless Transactions): ประยุกต์ใช้ ERC-4337 (Account Abstraction) ให้ร้านค้าสปอนเซอร์ค่าแก๊สแทนลูกค้า",
        "• ย้ายสู่ Layer 2 (L2): รองรับ Arbitrum, Optimism หรือ Base เพื่อลดค่าธรรมเนียมเหลือหลักสตางค์",
        "• การเชื่อมต่อ IoT Scale: พัฒนาฮาร์ดแวร์ตาชั่งดิจิทัลให้อ่านค่าน้ำหนักและส่งข้อมูลขึ้นบล็อกเชนอัตโนมัติ",
        "• การจัดเก็บภาพถ่ายบน IPFS/Filecoin: บันทึกรูปถ่ายเศษโลหะขณะชั่งลงระบบ Decentralized Storage จริง"
    ])

    # ==========================================
    # SLIDE 19: CONCLUSION
    # ==========================================
    s19 = prs.slides.add_slide(blank_layout)
    add_header_banner(s19, "Conclusion", "สรุปผลการดำเนินโครงการ")

    card19 = s19.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(2.4), Inches(10.9), Inches(4.5))
    card19.fill.solid()
    card19.fill.fore_color.rgb = COLOR_CARD_BG
    card19.line.color.rgb = COLOR_PRIMARY
    card19.line.width = Pt(2)
    tf19 = card19.text_frame
    tf19.word_wrap = True
    tf19.margin_left = Inches(0.8)
    tf19.margin_right = Inches(0.8)
    tf19.margin_top = Inches(0.4)

    p19_title = tf19.paragraphs[0]
    p19_title.text = "🏆 ความสำเร็จของโครงการ CopperPoint"
    p19_title.font.name = FONT_TITLE
    p19_title.font.size = Pt(26)
    p19_title.font.bold = True
    p19_title.font.color.rgb = COLOR_PRIMARY
    p19_title.space_after = Pt(15)

    bullets19 = [
        "1. บูรณาการเทคโนโลยีบล็อกเชนเข้ากับธุรกิจรีไซเคิลโลหะทองแดงได้สำเร็จเป็นรูปธรรม",
        "2. Smart Contract มาตรฐาน ERC-20 ทำงานได้ถูกต้องสมบูรณ์ พร้อมการตรวจสอบสิทธิ์และระบบความปลอดภัย",
        "3. เว็บแอปพลิเคชันใช้งานง่าย รองรับการคำนวณตามฐานข้อมูลทองแดง 46 รายการจริง และเชื่อมต่อ MetaMask สมบูรณ์",
        "4. ขึ้นสู่เครือข่าย Ethereum Sepolia Testnet และผ่านการ Verified บน Etherscan เรียบร้อย 100%",
        "5. สร้างความโปร่งใสในระบบแต้มสะสมและเป็นโครงสร้างพื้นฐานสำคัญสำหรับการพัฒนา Circular Economy ในอนาคต"
    ]
    for b in bullets19:
        p = tf19.add_paragraph()
        p.text = b
        p.font.name = FONT_BODY
        p.font.size = Pt(16)
        p.font.color.rgb = COLOR_DARK
        p.space_after = Pt(10)

    # ==========================================
    # SLIDE 20: THANK YOU
    # ==========================================
    s20 = prs.slides.add_slide(blank_layout)
    frame20 = s20.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.6), Inches(0.6), Inches(12.133), Inches(6.3))
    frame20.fill.background()
    frame20.line.color.rgb = COLOR_PRIMARY
    frame20.line.width = Pt(2)

    tb20 = s20.shapes.add_textbox(Inches(1.5), Inches(2.2), Inches(10.33), Inches(3.0))
    tf20 = tb20.text_frame
    p20_1 = tf20.paragraphs[0]
    p20_1.text = "THANK YOU"
    p20_1.font.name = FONT_TITLE
    p20_1.font.size = Pt(64)
    p20_1.font.bold = True
    p20_1.font.color.rgb = COLOR_PRIMARY
    p20_1.alignment = PP_ALIGN.CENTER

    p20_2 = tf20.add_paragraph()
    p20_2.text = "ขอขอบพระคุณคณะกรรมการและอาจารย์ที่ปรึกษาทุกท่าน"
    p20_2.font.name = FONT_BODY
    p20_2.font.size = Pt(22)
    p20_2.font.bold = True
    p20_2.font.color.rgb = COLOR_SECONDARY
    p20_2.alignment = PP_ALIGN.CENTER
    p20_2.space_before = Pt(15)

    p20_3 = tf20.add_paragraph()
    p20_3.text = "Questions & Answers (Q&A)"
    p20_3.font.name = FONT_BODY
    p20_3.font.size = Pt(18)
    p20_3.font.color.rgb = COLOR_MUTED
    p20_3.alignment = PP_ALIGN.CENTER
    p20_3.space_before = Pt(10)

    output_path = "/Users/nutchaphonsanitnok/Desktop/งาน/blockchain/COPPERPOINT_PRESENTATION.pptx"
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    create_deck()
