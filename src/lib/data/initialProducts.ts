import { Product } from '../supabase/database.types';

export const INITIAL_PRODUCTS: Product[] = [
  // 1. เครื่องครัว (kitchenware)
  {
    id: 'prod-kw-01',
    name: 'กระทะนอนสติ๊กเคลือบเซรามิกมินิมอล 28 ซม.',
    description: 'กระทะเคลือบเซรามิกเกรดพรีเมียม ปราศจากสาร PTFE/PFOA 100% กระจายความร้อนได้สม่ำเสมอ ด้ามจับไม้บีชแท้กันความร้อน ใช้งานได้กับเตาทุกประเภทรวมถึงเตาแม่เหล็กไฟฟ้า',
    sku: 'KW-CER-2801',
    price: 1490.00,
    cost_price: 780.00,
    stock_quantity: 18,
    category_id: 'cat-kitchenware',
    images: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['กระทะ', 'เครื่องครัว', 'เซรามิก', 'Non-stick'],
    staff_notes: 'ล็อตผลิต ก.ย. 2026 จากโรงงานญี่ปุ่น มีคู่มือภาษาไทยในกล่อง รับประกันสารเคลือบ 1 ปี',
    is_active: true,
    created_at: new Date('2026-01-10').toISOString(),
    updated_at: new Date('2026-01-10').toISOString(),
  },
  {
    id: 'prod-kw-02',
    name: 'ชุดมีดทำครัวสแตนเลสเยอรมัน 5 ชิ้น พร้อมแท่นแม่เหล็ก',
    description: 'ชุดมีดเชฟระดับมืออาชีพ ใบมีดสแตนเลสเยอรมันแท้ High Carbon ทนทาน คมนาน ไม่เป็นสนิม พร้อมแท่นวางไม้โอ๊คฝังแม่เหล็กนีโอไดเมียมอย่างดี',
    sku: 'KW-KNIFE-5SET',
    price: 2890.00,
    cost_price: 1450.00,
    stock_quantity: 4, // Low stock test
    category_id: 'cat-kitchenware',
    images: [
      'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['มีดเชฟ', 'สแตนเลส', 'งานเยอรมัน', 'พรีเมียม'],
    staff_notes: 'เหลือน้อยใกล้หมด สั่งจองเพิ่มกับซัพพลายเออร์แล้ว คาดว่าสินค้าเข้าปลายเดือน',
    is_active: true,
    created_at: new Date('2026-01-12').toISOString(),
    updated_at: new Date('2026-01-12').toISOString(),
  },
  {
    id: 'prod-kw-03',
    name: 'กาต้มน้ำดริปกาแฟควบคุมอุณหภูมิคอห่าน 800ml',
    description: 'กาต้มน้ำไฟฟ้าปากห่าน สำหรับดริปกาแฟ ควบคุมอุณหภูมิได้แม่นยำระดับ 1 องศาเซลเซียส หน้าจอ LED ดิจิทัล โหมดคงอุณหภูมิได้นาน 60 นาที',
    sku: 'KW-KETTLE-800',
    price: 2150.00,
    cost_price: 1100.00,
    stock_quantity: 12,
    category_id: 'cat-kitchenware',
    images: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['กาต้มน้ำ', 'ดริปกาแฟ', 'บาริสต้า', 'มินิมอล'],
    staff_notes: 'ทดสอบปลั๊กไทยและมาตรฐาน มอก. แล้ว เสียบใช้ได้เลยไม่ต้องแปลงหัว',
    is_active: true,
    created_at: new Date('2026-01-15').toISOString(),
    updated_at: new Date('2026-01-15').toISOString(),
  },

  // 2. ของใช้ในบ้าน (home-essentials)
  {
    id: 'prod-he-01',
    name: 'ถังขยะระบบเซนเซอร์อัตโนมัติ 15L ฝาปิดสนิทเก็บกลิ่น',
    description: 'ถังขยะเปิด-ปิดอัตโนมัติด้วยเซนเซอร์อินฟราเรดความเร็วสูง 0.3 วินาที ซีลยางรอบขอบฝาป้องกันกลิ่นรบกวน 100% ตัวถังพลาสติก ABS เคลือบสารป้องกันรอยนิ้วมือ',
    sku: 'HE-BIN-15AUT',
    price: 890.00,
    cost_price: 430.00,
    stock_quantity: 25,
    category_id: 'cat-home-essentials',
    images: [
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['ถังขยะเซนเซอร์', 'ของใช้ในบ้าน', 'สมาร์ทไลฟ์'],
    staff_notes: 'ใช้ถ่าน AA x 2 ก้อน ไม่รวมในกล่อง แถมถุงขยะมาตรฐาน 1 ม้วน',
    is_active: true,
    created_at: new Date('2026-01-18').toISOString(),
    updated_at: new Date('2026-01-18').toISOString(),
  },
  {
    id: 'prod-he-02',
    name: 'ชุดกล่องจัดระเบียบตู้เสื้อผ้าผ้าลินินพับได้ (เซ็ต 3 ชิ้น)',
    description: 'กล่องเก็บเสื้อผ้าและของใช้ผลิตจากผ้าฝ้ายผสมลินินธรรมชาติ โครงด้านในเสริมพลาสติกแข็งแรง ซ้อนทับได้ไม่ยุบตัว พับเก็บแบนราบได้เมื่อไม่ใช้งาน',
    sku: 'HE-BOX-LIN3',
    price: 590.00,
    cost_price: 260.00,
    stock_quantity: 32,
    category_id: 'cat-home-essentials',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['กล่องจัดระเบียบ', 'มินิมอล', 'ผ้าลินิน', 'จัดบ้าน'],
    staff_notes: 'สินค้าขายดีประจำสัปดาห์ แนะนำให้จัดคู่กับไม้แขวนเสื้อไม้',
    is_active: true,
    created_at: new Date('2026-01-20').toISOString(),
    updated_at: new Date('2026-01-20').toISOString(),
  },

  // 3. อุปกรณ์ทำสวน (gardening)
  {
    id: 'prod-gd-01',
    name: 'กรรไกรตัดแต่งกิ่งไม้ SK5 สไตล์ญี่ปุ่นด้ามจับไม้แท้',
    description: 'กรรไกรตัดแต่งกิ่งและบอนไซ ใบมีดเหล็กกล้า SK-5 ความแข็งสูง คมกริบ ตัดกิ่งไม้หนาได้ถึง 20 มม. ด้ามจับหุ้มไม้สักแท้ จับกระชับมือ',
    sku: 'GD-SHEAR-SK5',
    price: 650.00,
    cost_price: 290.00,
    stock_quantity: 15,
    category_id: 'cat-gardening',
    images: [
      'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['กรรไกรตัดกิ่ง', 'ทำสวน', 'SK5', 'ญี่ปุ่น'],
    staff_notes: 'ชุบน้ำมันกันสนิมมาจากโรงงาน แนะนำให้แจ้งลูกค้าเช็ดแห้งหลังใช้งาน',
    is_active: true,
    created_at: new Date('2026-01-22').toISOString(),
    updated_at: new Date('2026-01-22').toISOString(),
  },
  {
    id: 'prod-gd-02',
    name: 'บัวรดน้ำมินิมอลสแตนเลสปากยาว 1.5 ลิตร สีแมตต์แบล็ค',
    description: 'บัวรดน้ำดีไซน์นอร์ดิก ผลิตจากสแตนเลสเกรด 304 เคลือบสีพาวเดอร์โค้ทสีดำด้าน ปากยาวเรียวรดน้ำได้แม่นยำถึงโคนต้นโดยไม่เลอะใบ',
    sku: 'GD-CAN-15BK',
    price: 490.00,
    cost_price: 210.00,
    stock_quantity: 0, // Out of stock test
    category_id: 'cat-gardening',
    images: [
      'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['บัวรดน้ำ', 'แต่งสวน', 'สแตนเลส', 'นอร์ดิก'],
    staff_notes: 'สินค้าหมดชั่วคราว รอคอนเฟิร์มรอบเรือจากต่างประเทศ สัปดาห์หน้า',
    is_active: true,
    created_at: new Date('2026-01-25').toISOString(),
    updated_at: new Date('2026-01-25').toISOString(),
  },

  // 4. เครื่องมือช่าง (tools-hardware)
  {
    id: 'prod-th-01',
    name: 'สว่านกระแทกไร้สายบรัชเลส 20V พร้อมชุดดอกเจาะ 30 ชิ้น',
    description: 'สว่านไร้สายมอเตอร์ไร้แปรงถ่าน (Brushless) แรงบิดสูงสุด 65 N.m ปรับเกียร์ได้ 2 ระดับ เจาะได้ทั้งไม้ เหล็ก และคอนกรีต พร้อมแบตเตอรี่ 2.0Ah x 2 ก้อน',
    sku: 'TH-DRILL-20BL',
    price: 3450.00,
    cost_price: 1950.00,
    stock_quantity: 8,
    category_id: 'cat-tools-hardware',
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['สว่านไร้สาย', 'เครื่องมือช่าง', 'Brushless', 'งานช่าง'],
    staff_notes: 'รับประกันมอเตอร์ 2 ปี แบตเตอรี่ 1 ปี บันทึกซีเรียลนัมเบอร์ทุกครั้งที่ส่งมอบ',
    is_active: true,
    created_at: new Date('2026-01-28').toISOString(),
    updated_at: new Date('2026-01-28').toISOString(),
  },
  {
    id: 'prod-th-02',
    name: 'ชุดไขควงแม่เหล็กความแม่นยำสูง 64-in-1 สำหรับอิเล็กทรอนิกส์',
    description: 'เคสอลูมิเนียมเปิดแบบกดสปริง ดอกไขควงเหล็ก S2 ชุบกันสนิม 64 รูปแบบ หัวแม่เหล็กแรงสูง สำหรับซ่อมมือถือ นาฬิกา แว่นตา และอุปกรณ์อิเล็กทรอนิกส์',
    sku: 'TH-SCREW-64P',
    price: 520.00,
    cost_price: 240.00,
    stock_quantity: 40,
    category_id: 'cat-tools-hardware',
    images: [
      'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['ชุดไขควง', 'งานซ่อม', 'DIY', 'Precision'],
    staff_notes: 'มีสินค้าในสต็อกแน่น พร้อมจำหน่ายสำหรับลูกค้างาน DIY และช่างซ่อม',
    is_active: true,
    created_at: new Date('2026-02-01').toISOString(),
    updated_at: new Date('2026-02-01').toISOString(),
  },

  // 5. อุปกรณ์แต่งบ้าน (home-decor)
  {
    id: 'prod-hd-01',
    name: 'โคมไฟตั้งโต๊ะมินิมอลฐานไม้โอ๊ค โคมแก้วฝ้า Warm White',
    description: 'โคมไฟตั้งโต๊ะตกแต่งห้องนอนหรือห้องทำงาน ให้แสงนวลตา 3000K ถนอมสายตา ฐานไม้โอ๊คแท้คัดลาย สวิตช์หรี่ไฟแบบสัมผัส (Touch Dimmer)',
    sku: 'HD-LAMP-OAK01',
    price: 1290.00,
    cost_price: 580.00,
    stock_quantity: 11,
    category_id: 'cat-home-decor',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['โคมไฟ', 'แต่งบ้าน', 'มินิมอล', 'Warm White'],
    staff_notes: 'หลอดไฟ LED E27 บรรจุมาพร้อมในกล่อง แพ็คกันกระแทกอย่างดีสำหรับจัดส่ง',
    is_active: true,
    created_at: new Date('2026-02-05').toISOString(),
    updated_at: new Date('2026-02-05').toISOString(),
  },
  {
    id: 'prod-hd-02',
    name: 'แจกันเซรามิกสไตล์แจแปนดิ (Japandi) ผิวสัมผัสเนื้อทราย',
    description: 'แจกันแฮนด์เมดทรงเรขาคณิต ผิวสัมผัสแบบด้านเนื้อทราย โทนสีครีมเอิร์ธโทน เหมาะสำหรับจัดดอกไม้แห้ง กิ่งยูคาลิปตัส หรือวางเป็นงานศิลปะเดี่ยว',
    sku: 'HD-VASE-JP02',
    price: 790.00,
    cost_price: 320.00,
    stock_quantity: 16,
    category_id: 'cat-home-decor',
    images: [
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['แจกัน', 'Japandi', 'เซรามิก', 'มินิมอล'],
    staff_notes: 'สินค้าเปราะบาง ต้องห่อบับเบิ้ล 3 ชั้นก่อนจัดส่งขนส่งภายนอก',
    is_active: true,
    created_at: new Date('2026-02-08').toISOString(),
    updated_at: new Date('2026-02-08').toISOString(),
  },

  // 6. Gadgets (gadgets)
  {
    id: 'prod-gg-01',
    name: 'แท่นชาร์จไร้สาย 3-in-1 อลูมิเนียมอัลลอยด์ สำหรับ Phone/Watch/AirPods',
    description: 'ชาร์จพร้อมกัน 3 อุปกรณ์อย่างรวดเร็ว รองรับมาตรฐาน Qi กำลังไฟสูงสุด 15W รองรับระบบแม่เหล็ก MagSafe พับเก็บพกพาสะดวก วัสดุอะลูมิเนียมเกรดอากาศยาน',
    sku: 'GG-CHG-3IN1',
    price: 1890.00,
    cost_price: 920.00,
    stock_quantity: 14,
    category_id: 'cat-gadgets',
    images: [
      'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['แท่นชาร์จ', 'MagSafe', 'Gadgets', 'Smart Phone'],
    staff_notes: 'แถมสาย Type-C to Type-C 1.2 เมตรในกล่อง รองรับหัวชาร์จ PD 30W ขึ้นไป',
    is_active: true,
    created_at: new Date('2026-02-12').toISOString(),
    updated_at: new Date('2026-02-12').toISOString(),
  },
  {
    id: 'prod-gg-02',
    name: 'เครื่องวัดอุณหภูมิและความชื้นดิจิทัลหน้าจอ E-Ink เชื่อมต่อบลูทูธ',
    description: 'เซนเซอร์ตรวจวัดความละเอียดสูงจาก Sensirion สวิสเซอร์แลนด์ แสดงผลบนจอ E-Ink ถนอมสายตามุมมองกว้าง 178 องศา แบตเตอรี่ใช้งานได้นาน 1 ปี ซิงค์ข้อมูลเข้าสมาร์ทโฟน',
    sku: 'GG-SENS-TH01',
    price: 490.00,
    cost_price: 210.00,
    stock_quantity: 3, // Low stock test
    category_id: 'cat-gadgets',
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['เซนเซอร์', 'Smart Home', 'E-Ink', 'Gadgets'],
    staff_notes: 'เชื่อมต่อผ่านแอปพลิเคชัน Mi Home หรือ Apple HomeKit ผ่าน Gateway',
    is_active: true,
    created_at: new Date('2026-02-15').toISOString(),
    updated_at: new Date('2026-02-15').toISOString(),
  },

  // 7. หมวดหมู่อื่นๆ: แคมป์ปิ้ง & เอาท์ดอร์ (is_custom = true)
  {
    id: 'prod-cp-01',
    name: 'เก้าอี้แคมป์ปิ้งพับได้น้ำหนักเบาพิเศษ โครงอลูมิเนียม 7075',
    description: 'เก้าอี้สนามน้ำหนักเพียง 980 กรัม แต่รับน้ำหนักได้ถึง 140 กก. ผ้า Oxford 600D กันน้ำ ระบายอากาศได้ดี พับเก็บใส่กระเป๋าพกพาขนาดกะทัดรัด เหมาะสำหรับแคมป์ปิ้งและปิกนิก',
    sku: 'CP-CHAIR-7075',
    price: 1190.00,
    cost_price: 580.00,
    stock_quantity: 9,
    category_id: 'cat-camping-outdoor',
    images: [
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['เก้าอี้สนาม', 'แคมป์ปิ้ง', 'เดินป่า', 'อื่นๆ'],
    staff_notes: 'จัดโปรโมชั่นคู่กับโต๊ะแคมป์ปิ้ง ลดทันที 15% หน้าร้าน',
    is_active: true,
    created_at: new Date('2026-02-20').toISOString(),
    updated_at: new Date('2026-02-20').toISOString(),
  },

  // 8. หมวดหมู่อื่นๆ: อุปกรณ์สัตว์เลี้ยง (is_custom = true)
  {
    id: 'prod-pet-01',
    name: 'น้ำพุแมวสแตนเลส 304 ไร้สาย ระบบกรอง 4 ชั้น ความจุ 2.5L',
    description: 'ตัวถังสแตนเลส 304 ป้องกันการสะสมของแบคทีเรียและสิวคางแมว มอเตอร์เงียบพิเศษต่ำกว่า 20dB ระบบเซนเซอร์จ่ายน้ำเมื่อแมวเดินเข้าใกล้ แบตเตอรี่ในตัวชาร์จครั้งเดียวอยู่ได้ 30 วัน',
    sku: 'PET-FOUN-304',
    price: 1350.00,
    cost_price: 640.00,
    stock_quantity: 7,
    category_id: 'cat-pet-supplies',
    images: [
      'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['น้ำพุแมว', 'สัตว์เลี้ยง', 'สแตนเลส 304', 'อื่นๆ'],
    staff_notes: 'แถมไส้กรองสำรอง 2 ชิ้นในกล่อง มีไส้กรองอะไหล่ขายแยก SKU: PET-FILTER-3P',
    is_active: true,
    created_at: new Date('2026-02-25').toISOString(),
    updated_at: new Date('2026-02-25').toISOString(),
  }
];
