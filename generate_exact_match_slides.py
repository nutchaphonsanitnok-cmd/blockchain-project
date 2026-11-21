import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_exact_slides():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Colors matched to the user's sample slide (Rose/Maroon minimal elegant theme)
    C_BG = RGBColor(255, 255, 255)
    C_TITLE = RGBColor(140, 50, 55)         # Deep maroon / burgundy for title
    C_OUTSIDE_BG = RGBColor(241, 238, 233)   # Warm neutral light gray
    C_OUTSIDE_BORDER = RGBColor(215, 208, 198)
    C_BUILT_BG = RGBColor(254, 235, 235)     # Soft rose pink
    C_BUILT_BORDER = RGBColor(230, 160, 160)
    C_BUILT_TEXT = RGBColor(140, 45, 50)
    C_CONTAINER_BORDER = RGBColor(210, 205, 200)
    C_TEXT_MAIN = RGBColor(50, 50, 50)
    C_TEXT_MUTED = RGBColor(120, 115, 110)
    C_ARROW = RGBColor(140, 135, 130)
    C_RED_ARROW = RGBColor(215, 75, 75)

    FONT_TITLE = "Georgia"
    FONT_MAIN = "Arial"

    def set_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_BG
        bg.line.fill.background()
        return bg

    def add_slide_title(slide, title_text):
        tb = slide.shapes.add_textbox(Inches(1.0), Inches(0.8), Inches(9.0), Inches(1.0))
        tf = tb.text_frame
        p = tf.paragraphs[0]
        p.text = title_text.upper()
        p.font.name = FONT_TITLE
        p.font.size = Pt(36)
        p.font.bold = False
        p.font.color.rgb = C_TITLE

        # 3 dots decoration
        tb_dots = slide.shapes.add_textbox(Inches(10.5), Inches(0.8), Inches(2.0), Inches(1.0))
        p_d = tb_dots.text_frame.paragraphs[0]
        p_d.text = "●  ●  ●"
        p_d.font.name = FONT_MAIN
        p_d.font.size = Pt(14)
        p_d.font.color.rgb = C_TITLE
        p_d.alignment = PP_ALIGN.RIGHT

    def add_card(slide, left, top, width, height, title, subtitle="", is_built=False):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = C_BUILT_BG if is_built else C_OUTSIDE_BG
        card.line.color.rgb = C_BUILT_BORDER if is_built else C_OUTSIDE_BORDER
        card.line.width = Pt(1.0)

        tf = card.text_frame
        tf.word_wrap = True
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE

        p = tf.paragraphs[0]
        p.text = title
        p.font.name = FONT_MAIN
        p.font.size = Pt(14) if subtitle else Pt(15)
        p.font.bold = True
        p.font.color.rgb = C_BUILT_TEXT if is_built else C_TEXT_MAIN
        p.alignment = PP_ALIGN.CENTER

        if subtitle:
            p_sub = tf.add_paragraph()
            p_sub.text = subtitle
            p_sub.font.name = FONT_MAIN
            p_sub.font.size = Pt(11)
            p_sub.font.color.rgb = C_BUILT_TEXT if is_built else C_TEXT_MUTED
            p_sub.alignment = PP_ALIGN.CENTER
            p_sub.space_before = Pt(3)

        return card

    # ============================================================
    # SLIDE 1: EXACT ARCHITECTURE (LIKE USER SCREENSHOT 1)
    # ============================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_bg(s1)
    add_slide_title(s1, "ARCHITECTURE")

    # 1. Top Roles (4 boxes)
    roles = ["Customer (Seller)", "Staff (Minter)", "Merchant", "Admin"]
    role_w = Inches(1.8)
    role_h = Inches(0.55)
    role_gap = Inches(0.4)
    start_x = Inches(2.5)

    for i, r in enumerate(roles):
        x = start_x + i * (role_w + role_gap)
        add_card(s1, x, Inches(2.2), role_w, role_h, r)

    # 2. Middle Row: Hosting -> Web App -> MetaMask
    add_card(s1, Inches(2.3), Inches(3.2), Inches(2.0), Inches(0.75), "Vercel", "Online hosting")
    add_card(s1, Inches(4.7), Inches(3.1), Inches(3.9), Inches(0.95), "Web app", "Vite, React, ethers.js, 46 scrap catalog", is_built=True)
    add_card(s1, Inches(9.0), Inches(3.2), Inches(2.0), Inches(0.75), "MetaMask", "Signs transactions")

    # Connecting arrows for middle row
    arr1 = s1.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, Inches(4.35), Inches(3.5), Inches(0.3), Inches(0.12))
    arr1.fill.solid()
    arr1.fill.fore_color.rgb = C_ARROW
    arr1.line.fill.background()

    arr2 = s1.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, Inches(8.65), Inches(3.5), Inches(0.3), Inches(0.12))
    arr2.fill.solid()
    arr2.fill.fore_color.rgb = C_ARROW
    arr2.line.fill.background()

    # Arrow down from Web App / MetaMask to Contract
    arr_down = s1.shapes.add_shape(MSO_SHAPE.DOWN_ARROW, Inches(10.0), Inches(4.05), Inches(0.15), Inches(0.45))
    arr_down.fill.solid()
    arr_down.fill.fore_color.rgb = C_ARROW
    arr_down.line.fill.background()

    # 3. Contract Container Box
    c_box = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(2.3), Inches(4.6), Inches(8.7), Inches(1.5))
    c_box.fill.background()
    c_box.line.color.rgb = C_CONTAINER_BORDER
    c_box.line.width = Pt(1.0)

    # Contract Label
    tb_c = s1.shapes.add_textbox(Inches(2.5), Inches(4.7), Inches(6.0), Inches(0.35))
    p_cl = tb_c.text_frame.paragraphs[0]
    p_cl.text = "CopperPoint contract on Sepolia"
    p_cl.font.name = FONT_MAIN
    p_cl.font.size = Pt(12)
    p_cl.font.bold = True
    p_cl.font.color.rgb = C_TEXT_MAIN

    # 3 Boxes inside Contract
    c_cards = [
        ("Access control", "Who can do what"),
        ("Token rules", "Mint, 1-click burn, quota"),
        ("Event log", "Audit trail with scrap details")
    ]
    card_in_w = Inches(2.6)
    card_in_h = Inches(0.75)
    for i, (ct, cs) in enumerate(c_cards):
        x = Inches(2.6 + i * 2.85)
        add_card(s1, x, Inches(5.15), card_in_w, card_in_h, ct, cs, is_built=True)

    # Arrow down from Contract to Etherscan
    arr_down2 = s1.shapes.add_shape(MSO_SHAPE.DOWN_ARROW, Inches(6.6), Inches(6.15), Inches(0.15), Inches(0.4))
    arr_down2.fill.solid()
    arr_down2.fill.fore_color.rgb = C_ARROW
    arr_down2.line.fill.background()

    # 4. Etherscan Box
    add_card(s1, Inches(5.6), Inches(6.6), Inches(2.1), Inches(0.55), "Etherscan")

    # 5. Legend (bottom right)
    leg_x = Inches(10.0)
    leg_y = Inches(6.5)
    sq1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, leg_x, leg_y, Inches(0.18), Inches(0.18))
    sq1.fill.solid()
    sq1.fill.fore_color.rgb = C_BUILT_BG
    sq1.line.color.rgb = C_BUILT_BORDER
    tb_l1 = s1.shapes.add_textbox(leg_x + Inches(0.25), leg_y - Inches(0.08), Inches(2.0), Inches(0.3))
    p_l1 = tb_l1.text_frame.paragraphs[0]
    p_l1.text = "Built in this project"
    p_l1.font.size = Pt(10)
    p_l1.font.color.rgb = C_TEXT_MUTED

    sq2 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, leg_x, leg_y + Inches(0.28), Inches(0.18), Inches(0.18))
    sq2.fill.solid()
    sq2.fill.fore_color.rgb = C_OUTSIDE_BG
    sq2.line.color.rgb = C_OUTSIDE_BORDER
    tb_l2 = s1.shapes.add_textbox(leg_x + Inches(0.25), leg_y + Inches(0.20), Inches(2.0), Inches(0.3))
    p_l2 = tb_l2.text_frame.paragraphs[0]
    p_l2.text = "Outside the project"
    p_l2.font.size = Pt(10)
    p_l2.font.color.rgb = C_TEXT_MUTED

    # ============================================================
    # SLIDE 2: EXACT WORKFLOW SEQUENCE (LIKE USER SCREENSHOT 2)
    # ============================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_bg(s2)
    add_slide_title(s2, "WORKFLOW")

    # Actors / Swimlanes
    actors = [
        ("Staff (Minter)", False),
        ("Customer", False),
        ("Merchant", False),
        ("Contract", True)
    ]
    act_w = Inches(1.7)
    act_h = Inches(0.55)
    act_y = Inches(2.0)
    act_x_list = [Inches(2.5), Inches(4.8), Inches(7.1), Inches(9.4)]

    for i, (name, is_built) in enumerate(actors):
        x = act_x_list[i]
        add_card(s2, x, act_y, act_w, act_h, name, is_built=is_built)

        # Dashed lifeline
        line = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, x + Inches(0.84), Inches(2.6), Inches(0.02), Inches(4.3))
        line.fill.solid()
        line.fill.fore_color.rgb = RGBColor(220, 215, 210)
        line.line.fill.background()

    # Steps (1) through (7)
    # Coordinates of lifelines:
    x_staff = act_x_list[0] + Inches(0.85)
    x_cust = act_x_list[1] + Inches(0.85)
    x_merch = act_x_list[2] + Inches(0.85)
    x_contract = act_x_list[3] + Inches(0.85)

    def add_step_num(slide, y, num_str):
        c = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(1.8), y - Inches(0.1), Inches(0.28), Inches(0.28))
        c.fill.background()
        c.line.color.rgb = RGBColor(180, 175, 170)
        tf = c.text_frame
        p = tf.paragraphs[0]
        p.text = num_str
        p.font.size = Pt(9)
        p.font.color.rgb = C_TEXT_MUTED
        p.alignment = PP_ALIGN.CENTER

    def add_msg_arrow(slide, x_from, x_to, y, text, subtext="", is_red=False, is_dashed=False):
        w = abs(x_to - x_from)
        left = min(x_from, x_to)
        shape_type = MSO_SHAPE.RIGHT_ARROW if x_to > x_from else MSO_SHAPE.LEFT_ARROW
        arr = slide.shapes.add_shape(shape_type, left, y, w, Inches(0.04))
        arr.fill.solid()
        arr.fill.fore_color.rgb = C_RED_ARROW if is_red else C_TEXT_MAIN
        arr.line.fill.background()

        tb = slide.shapes.add_textbox(left, y - Inches(0.35), w, Inches(0.3))
        p = tb.text_frame.paragraphs[0]
        p.text = text
        p.font.name = FONT_MAIN
        p.font.size = Pt(11)
        p.font.color.rgb = C_RED_ARROW if is_red else C_TEXT_MAIN
        p.alignment = PP_ALIGN.CENTER

        if subtext:
            tb_s = slide.shapes.add_textbox(left, y + Inches(0.03), w, Inches(0.25))
            ps = tb_s.text_frame.paragraphs[0]
            ps.text = subtext
            ps.font.name = FONT_MAIN
            ps.font.size = Pt(9)
            ps.font.color.rgb = C_TEXT_MUTED
            ps.alignment = PP_ALIGN.CENTER

    # 1. Customer -> Staff: scan wallet QR / sell copper
    add_step_num(s2, Inches(2.9), "1")
    add_msg_arrow(s2, x_cust, x_staff, Inches(2.9), "scan wallet QR, sell scrap", is_red=True)

    # 2. Staff -> Contract: mintWithScrapDetails(...)
    add_step_num(s2, Inches(3.5), "2")
    add_msg_arrow(s2, x_staff, x_contract, Inches(3.5), "mintWithScrapDetails(customer, 260)", "role + quota check")

    # 3. Contract -> Customer: balance +260 CUP
    add_step_num(s2, Inches(4.1), "3")
    add_msg_arrow(s2, x_contract, x_cust, Inches(4.1), "balance +260 CUP, ScrapTraded", is_dashed=True)

    # 4. Customer -> Merchant: payment / redeem QR
    add_step_num(s2, Inches(4.7), "4")
    add_msg_arrow(s2, x_cust, x_merch, Inches(4.7), "redeem QR, 100 CUP", is_red=True)

    # 5. Customer -> Contract: burnSelf (or approve)
    add_step_num(s2, Inches(5.3), "5")
    add_msg_arrow(s2, x_cust, x_contract, Inches(5.3), "burnSelf(100) or approve(shop, 100)")

    # 6. Merchant -> Contract: merchantRedeem(customer, 100)
    add_step_num(s2, Inches(5.9), "6")
    add_msg_arrow(s2, x_merch, x_contract, Inches(5.9), "merchantRedeem(100)", "checks allowance / event")

    # 7. Contract -> Customer: balance -100, burned
    add_step_num(s2, Inches(6.5), "7")
    add_msg_arrow(s2, x_contract, x_cust, Inches(6.5), "balance -100, burned & RewardRedeemed", is_dashed=True)

    output = "COPPERPOINT_EXACT_SLIDES.pptx"
    prs.save(output)
    print(f"Created: {output}")

if __name__ == "__main__":
    create_exact_slides()
