export type ProductCategory = 'computing' | 'appliances' | 'industrial';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductOption {
  id: string;
  label: string;
  priceDelta: number;
  specSummary: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  categoryLabel: string;
  basePrice: number;
  imageUrl: string;
  leadTime: string;
  stockCount: number;
  warrantyMonths: number;
  highlights: string[];
  specs: ProductSpec[];
  options: ProductOption[];
  architectureNote: string;
  efficiencyMetric: string;
  featuredPriority: number; // 1..6 shown initially on storefront
}

export interface CaseStudy {
  id: string;
  index: string;
  title: string;
  client: string;
  role: string;
  author: string;
  category: string;
  metricValue: string;
  metricUnit: string;
  timeframe: string;
  quote: string;
  outcomeSummary: string;
}

export interface PromoVoucher {
  code: string;
  label: string;
  discountPercent?: number;
  discountFixed?: number;
  minOrderAmount: number;
  description: string;
}

export const PROMO_VOUCHERS: PromoVoucher[] = [
  {
    code: 'AETHER2026',
    label: 'Giảm 2.500.000 ₫',
    discountFixed: 2500000,
    minOrderAmount: 20000000,
    description: 'Ưu đãi ra mắt thế hệ phần cứng 2026 (Đơn từ 20 triệu)'
  },
  {
    code: 'B2BPRO5',
    label: 'Chiết khấu 5% Dự án',
    discountPercent: 5,
    minOrderAmount: 80000000,
    description: 'Chiết khấu 5% cho đơn hàng doanh nghiệp & nhà máy từ 80 triệu'
  },
  {
    code: 'FREECALIB',
    label: 'Giảm 1.200.000 ₫ Hiệu chuẩn',
    discountFixed: 1200000,
    minOrderAmount: 15000000,
    description: 'Tặng gói hiệu chuẩn laser & lắp đặt tận nơi'
  }
];

export const HERO_BANNER_IMAGE =
  '/src/assets/images/hero_full_ecosystem_banner_1791363481787.jpg';

export const PRODUCTS: Product[] = [
  // ==================== 1. LAPTOP & MÁY TRẠM (COMPUTING - 6 ITEMS) ====================
  {
    id: 'aether-book-pro-16',
    sku: 'ATH-MBP16-X4',
    name: 'AetherBook Pro 16 Studio',
    subtitle:
      'Máy trạm di động vỏ Titanium nguyên khối chuẩn CNC với kiến trúc chip Aether X4 Max 16 nhân.',
    category: 'computing',
    categoryLabel: 'Laptop & Máy Trạm',
    basePrice: 68990000,
    imageUrl: '/src/assets/images/hero_workstation_pro_1791362635060.jpg',
    leadTime: 'Giao nhanh 2h nội thành',
    stockCount: 18,
    warrantyMonths: 36,
    featuredPriority: 1,
    highlights: [
      'Màn hình Tandem OLED ProMotion 120Hz chuẩn màu Delta E < 0.4',
      'Băng thông bộ nhớ hợp nhất 546 GB/s cho mô phỏng CAD & AI cục bộ',
      'Thời lượng pin liên tục 22 giờ với buồng tản nhiệt hơi nước kép'
    ],
    specs: [
      { label: 'Vi xử lý', value: 'Aether X4 Max (16-core CPU / 40-core GPU)' },
      { label: 'Bộ nhớ hợp nhất', value: '64GB — 128GB LPDDR5X ECC' },
      { label: 'Màn hình', value: '16.2" Tandem OLED (3456 × 2234), 1600 nits HDR' },
      { label: 'Cổng giao tiếp', value: '3× Thunderbolt 5 (120Gb/s), HDMI 2.1, SDXC UHS-III' },
      { label: 'Vật liệu khung vỏ', value: 'Titanium Cấp độ 5 tái chế 100%, dày 14.8 mm' }
    ],
    options: [
      {
        id: '64gb-2tb',
        label: '64GB RAM · 2TB NVMe Gen5',
        priceDelta: 0,
        specSummary: 'Cấu hình tiêu chuẩn cho kỹ sư thiết kế cơ khí & dựng phim 8K'
      },
      {
        id: '128gb-4tb',
        label: '128GB RAM · 4TB NVMe Gen5',
        priceDelta: 14000000,
        specSummary: 'Tối ưu cho huấn luyện mô hình ngôn ngữ lớn & mô phỏng CFD đa luồng'
      }
    ],
    architectureNote: 'Tiêu chuẩn MIL-STD-810H · Gia công nguyên khối',
    efficiencyMetric: '3.4× tốc độ kết xuất CAD 3D so với thế hệ trước'
  },
  {
    id: 'aether-studio-ultra-cube',
    sku: 'ATH-STU-UX4',
    name: 'AetherStudio Ultra Workstation',
    subtitle:
      'Siêu máy tính để bàn đúc từ khối nhôm nguyên khối 197mm, trang bị vi xử lý kép Aether X4 Ultra 32 nhân.',
    category: 'computing',
    categoryLabel: 'Laptop & Máy Trạm',
    basePrice: 112000000,
    imageUrl: '/src/assets/images/computing_studio_cube_ultra_1791363517722.jpg',
    leadTime: 'Giao hàng tiêu chuẩn 24h',
    stockCount: 9,
    warrantyMonths: 36,
    featuredPriority: 2,
    highlights: [
      'Cầu nối liên kết vi mạch UltraFusion băng thông 2.5 TB/s không độ trễ',
      'Bộ nhớ hợp nhất lên tới 256GB ECC chạy mô hình 70B tham số hoàn toàn nội bộ',
      'Hệ thống tản nhiệt lồng sóc đồng nguyên khối giữ nhiệt độ dưới 62°C ở 100% tải'
    ],
    specs: [
      { label: 'Vi xử lý', value: 'Aether X4 Ultra (32-core CPU / 80-core GPU)' },
      { label: 'Bộ nhớ hợp nhất', value: '128GB — 256GB LPDDR5X ECC (1,092 GB/s)' },
      { label: 'Lưu trữ nội bộ', value: '4TB — 16TB SSD NVMe RAID 0 (Tốc độ 14.2 GB/s)' },
      { label: 'Cổng kết nối', value: '6× Thunderbolt 5, 2× 10GbE RJ45, HDMI 2.1b' },
      { label: 'Kích thước khung vỏ', value: '197 × 197 × 95 mm · Nhôm nguyên khối 3.6 kg' }
    ],
    options: [
      {
        id: '128gb-4tb',
        label: '128GB Unified ECC · 4TB NVMe',
        priceDelta: 0,
        specSummary: 'Phù hợp cho phòng lab mô phỏng cơ học chất lỏng và kết xuất 3D'
      },
      {
        id: '256gb-8tb',
        label: '256GB Unified ECC · 8TB NVMe',
        priceDelta: 28000000,
        specSummary: 'Cấu hình máy chủ suy luận AI cục bộ và xử lý dữ liệu LiDAR nhà máy'
      }
    ],
    architectureNote: 'Băng thông 1,092 GB/s · 6× Thunderbolt 5',
    efficiencyMetric: 'Tiết kiệm 68% điện năng so với máy trạm Tower truyền thống'
  },
  {
    id: 'aether-book-air-14',
    sku: 'ATH-MBA14-X4',
    name: 'AetherBook Air 14 Field',
    subtitle:
      'Thiết kế không quạt siêu mỏng 11.2mm chuyên dụng cho kỹ sư vận hành nhà máy và di chuyển liên tục.',
    category: 'computing',
    categoryLabel: 'Laptop & Máy Trạm',
    basePrice: 39990000,
    imageUrl: '/src/assets/images/computing_book_air_14_1791363499424.jpg',
    leadTime: 'Giao nhanh 2h nội thành',
    stockCount: 26,
    warrantyMonths: 36,
    featuredPriority: 7,
    highlights: [
      'Tản nhiệt thụ động hoàn toàn bằng tấm dẫn nhiệt Graphite pha đồng',
      'Tích hợp cổng chẩn đoán công nghiệp RS-485 qua bộ chuyển đổi USB4',
      'Trọng lượng chỉ 1.18 kg với kính phủ chống phản xạ Nano-Texture'
    ],
    specs: [
      { label: 'Vi xử lý', value: 'Aether X4 Pro (12-core CPU / 18-core GPU)' },
      { label: 'Bộ nhớ hợp nhất', value: '32GB — 64GB LPDDR5X' },
      { label: 'Màn hình', value: '14.2" Liquid Retina XDR, phủ Nano-Texture chống chói' },
      { label: 'Kết nối không dây', value: 'Wi-Fi 7 (802.11be) & 5G Sub-6GHz tích hợp' },
      { label: 'Trọng lượng', value: '1.18 kg · Chuẩn kháng bụi IP54' }
    ],
    options: [
      {
        id: '32gb-1tb',
        label: '32GB RAM · 1TB SSD',
        priceDelta: 0,
        specSummary: 'Phiên bản tiêu chuẩn kính bóng độ tương phản cao'
      },
      {
        id: '64gb-2tb-nano',
        label: '64GB RAM · 2TB SSD · Kính Nano-Texture',
        priceDelta: 8500000,
        specSummary: 'Lớp phủ tán xạ ánh sáng cho môi trường nhà xưởng cường độ sáng cao'
      }
    ],
    architectureNote: '0 dBA Độ ồn vận hành · Tản nhiệt tĩnh',
    efficiencyMetric: '24 giờ hoạt động liên tục trong ca trực hiện trường'
  },
  {
    id: 'aether-pro-display-xdr32',
    sku: 'ATH-DSP-32X',
    name: 'AetherDisplay XDR 32 Reference',
    subtitle:
      'Màn hình tham chiếu 6K Retina 32 inch với mặt lưng nhôm phay CNC tản nhiệt ma trận tổ ong và chân đế đối trọng.',
    category: 'computing',
    categoryLabel: 'Laptop & Máy Trạm',
    basePrice: 84500000,
    imageUrl: '/src/assets/images/computing_display_xdr_32_1791363530918.jpg',
    leadTime: 'Giao hàng tiêu chuẩn 24h',
    stockCount: 11,
    warrantyMonths: 36,
    featuredPriority: 8,
    highlights: [
      'Độ phân giải 6K (6016 × 3384) với hơn 20.4 triệu điểm ảnh và độ sáng đỉnh 2000 nits',
      'Lớp kính khắc Nano-Texture ở cấp độ nanomet giảm phản xạ ánh sáng phòng lab xuống < 1.2%',
      'Mặt lưng nhôm CNC Lattice tản nhiệt thụ động hoàn toàn không dùng quạt'
    ],
    specs: [
      { label: 'Tấm nền & Độ phân giải', value: '32" IPS Oxide 6K (6016 × 3384) · 218 PPI' },
      { label: 'Độ sáng & Tương phản', value: '1000 nits toàn màn hình · 2000 nits đỉnh · 1,000,000:1' },
      { label: 'Độ phủ màu', value: '10-bit thực · 99.8% DCI-P3 & Adobe RGB · Delta E < 0.3' },
      { label: 'Kết nối & Cấp nguồn', value: '1× Thunderbolt 5 (Sạc ngược 140W), 3× USB-C 40Gb/s' },
      { label: 'Chân đế đi kèm', value: 'Pro Counterbalance Stand (Xoay dọc 90° & Nâng hạ không trọng lực)' }
    ],
    options: [
      {
        id: 'standard-glass-stand',
        label: 'Kính Tiêu Chuẩn + Chân Đế Pro Stand',
        priceDelta: 0,
        specSummary: 'Độ tương phản sâu tuyệt đối cho phòng dựng kiểm soát ánh sáng'
      },
      {
        id: 'nano-texture-stand',
        label: 'Kính Nano-Texture Chống Chói + Chân Đế Pro Stand',
        priceDelta: 9500000,
        specSummary: 'Khử lóa hoàn toàn trong không gian văn phòng nhiều cửa kính lớn'
      }
    ],
    architectureNote: '6K 20.4 Triệu Điểm Ảnh · Tản nhiệt Lattice CNC',
    efficiencyMetric: 'Chuẩn hóa đồng bộ 100% dải màu CAD/CAM & Dựng phim HDR'
  },
  {
    id: 'aether-pad-pro-13',
    sku: 'ATH-PAD13-X4',
    name: 'AetherPad Studio 13 CAD Slate',
    subtitle:
      'Máy tính bảng kỹ thuật mỏng 5.1mm vỏ Titanium đen nhám kèm bút cảm ứng lực từ trường và bàn phím lơ lửng.',
    category: 'computing',
    categoryLabel: 'Laptop & Máy Trạm',
    basePrice: 34900000,
    imageUrl: '/src/assets/images/computing_pad_studio_13_1791366572141.jpg',
    leadTime: 'Giao nhanh 2h nội thành',
    stockCount: 32,
    warrantyMonths: 24,
    featuredPriority: 9,
    highlights: [
      'Cảm biến LiDAR Kép quét không gian nhà xưởng thành mô hình 3D BIM/CAD ngay lập tức',
      'Màn hình Tandem OLED 13 inch 120Hz hỗ trợ bút AetherPencil Pro độ trễ 1.2 ms',
      'Chân đế bàn phím nhôm nguyên khối tích hợp cổng Thunderbolt 4 thứ hai trên bản lề'
    ],
    specs: [
      { label: 'Vi xử lý', value: 'Aether X4 (10-core CPU / 16-core GPU / 38 TOPS NPU)' },
      { label: 'Màn hình', value: '13.0" Tandem OLED (2752 × 2064) · Kính phủ AR' },
      { label: 'Bộ nhớ & Lưu trữ', value: '16GB — 32GB RAM · 1TB — 2TB NVMe' },
      { label: 'Cảm biến không gian', value: 'Dual dToF LiDAR Scanner · Chính xác ±1.5 mm ở 5m' },
      { label: 'Độ mỏng & Trọng lượng', value: '5.1 mm · 578 g (Chưa kèm bàn phím)' }
    ],
    options: [
      {
        id: '16gb-1tb-slate',
        label: '16GB RAM · 1TB SSD + Bút AetherPencil Pro',
        priceDelta: 0,
        specSummary: 'Trọn bộ thiết bị khảo sát kiến trúc và phác thảo kỹ thuật'
      },
      {
        id: '32gb-2tb-full',
        label: '32GB RAM · 2TB SSD + Bàn Phím Cantilever + Bút',
        priceDelta: 7600000,
        specSummary: 'Thay thế hoàn toàn máy trạm di động khi đi công tác hiện trường'
      }
    ],
    architectureNote: 'Siêu mỏng 5.1mm · Quét 3D LiDAR CAD',
    efficiencyMetric: 'Rút ngắn 60% thời gian đo đạc hiện trạng công trình'
  },
  {
    id: 'aether-server-blade-r2',
    sku: 'ATH-SRV-R2U',
    name: 'AetherBlade R2 Enterprise AI Server',
    subtitle:
      'Máy chủ Rack 2U phay CNC mặt lưới tổ ong trang bị 4 vi xử lý Aether X4 Ultra cho đám mây nội bộ nhà máy.',
    category: 'computing',
    categoryLabel: 'Laptop & Máy Trạm',
    basePrice: 265000000,
    imageUrl: '/src/assets/images/computing_server_blade_r2_1791366545853.jpg',
    leadTime: 'Đặt hàng kỹ thuật 3–5 ngày',
    stockCount: 5,
    warrantyMonths: 60,
    featuredPriority: 10,
    highlights: [
      'Tổng cộng 128 nhân CPU, 320 nhân GPU và 1TB bộ nhớ hợp nhất ECC trong khung 2U',
      'Tiêu thụ điện năng chỉ 1,200W ở tải tối đa — bằng 1/4 máy chủ GPU truyền thống',
      'Nguồn kép Redundant Titanium 96% và ổ cứng NVMe thay thế nóng (Hot-Swap)'
    ],
    specs: [
      { label: 'Cấu hình vi xử lý', value: 'Quad Aether X4 Ultra (128-core CPU / 320-core GPU)' },
      { label: 'Bộ nhớ hợp nhất', value: '512GB — 1024GB LPDDR5X ECC (4.36 TB/s tổng)' },
      { label: 'Giao tiếp mạng', value: '4× 100GbE QSFP28 + 2× 10GbE Quản trị IPMI' },
      { label: 'Lưu trữ Hot-Swap', value: '8× Khe U.3 NVMe Gen5 (Tối đa 128TB RAID Z2)' },
      { label: 'Chuẩn lắp đặt', value: 'Rack 19-inch 2U · Ray trượt không cần dụng cụ' }
    ],
    options: [
      {
        id: '512gb-16tb',
        label: '512GB ECC · 16TB NVMe Enterprise',
        priceDelta: 0,
        specSummary: 'Đáp ứng hạ tầng Digital Twin và MES cho nhà máy 500 nhân sự'
      },
      {
        id: '1tb-64tb',
        label: '1TB ECC · 64TB NVMe Enterprise RAID',
        priceDelta: 68000000,
        specSummary: 'Huấn luyện và vận hành LLM nội bộ bảo mật tuyệt đối không qua Internet'
      }
    ],
    architectureNote: 'Rack 2U Nhôm CNC · 4.36 TB/s Băng thông',
    efficiencyMetric: '-74% chi phí làm mát phòng máy chủ (Data Center PUE 1.12)'
  },

  // ==================== 2. MÁY MÓC GIA DỤNG (APPLIANCES - 6 ITEMS) ====================
  {
    id: 'aether-pure-climate-s1',
    sku: 'ATH-HOME-CS1',
    name: 'AtmosTower S1 Climate & Purifier',
    subtitle:
      'Tháp điều hòa vi khí hậu đối lưu Laminar kết hợp lọc phân tử Formaldehyde cho không gian kiến trúc mở.',
    category: 'appliances',
    categoryLabel: 'Máy Móc Gia Dụng',
    basePrice: 29900000,
    imageUrl: '/src/assets/images/appliance_climate_purifier_1791362659576.jpg',
    leadTime: 'Giao nhanh 2h nội thành',
    stockCount: 22,
    warrantyMonths: 36,
    featuredPriority: 3,
    highlights: [
      '42,000 lỗ vi xuyên cắt laser tạo luồng gió tầng êm dịu không gây bạt hơi',
      'Lõi xúc tác Cryptomelane phân hủy vĩnh viễn Formaldehyde thành H2O và CO2',
      'Đồng bộ trực tiếp với giao thức Matter, Apple HomeKit và hệ thống BMS tòa nhà'
    ],
    specs: [
      { label: 'Lưu lượng khí sạch (CADR)', value: '720 m³/giờ · Phủ diện tích 95 m²' },
      { label: 'Độ ồn ban đêm', value: '19.5 dBA (Chế độ Laminar Sleep)' },
      { label: 'Cảm biến môi trường', value: 'Laser PM2.5/PM10, VOCs, CO2, Nhiệt ẩm kế bạch kim' },
      { label: 'Công suất tiêu thụ', value: '6W — 42W (Biến tần DC Inverter)' },
      { label: 'Kích thước & Vật liệu', value: 'Ø 280 × 1040 mm · Nhôm nguyên khối phay CNC' }
    ],
    options: [
      {
        id: 'purifier-only',
        label: 'Phiên bản Lọc khí & Đối lưu',
        priceDelta: 0,
        specSummary: 'Tối ưu cho căn hộ tiêu chuẩn và phòng làm việc yên tĩnh'
      },
      {
        id: 'climate-humidifier',
        label: 'Tích hợp Cân bằng Ẩm siêu âm vô trùng',
        priceDelta: 4200000,
        specSummary: 'Kiểm soát độ ẩm chính xác ở mức 45%–55% không tạo sương mù'
      }
    ],
    architectureNote: '19.5 dBA Vận hành tĩnh lặng · Xúc tác phân tử',
    efficiencyMetric: '720 m³/h tốc độ tuần hoàn không khí tinh khiết'
  },
  {
    id: 'aether-cyclone-v12',
    sku: 'ATH-HOME-V12',
    name: 'AeroCyclone V12 Acoustic',
    subtitle:
      'Hệ thống máy hút bụi & làm sạch bề mặt tự hành sử dụng động cơ từ trường không chổi than 140,000 vòng/phút.',
    category: 'appliances',
    categoryLabel: 'Máy Móc Gia Dụng',
    basePrice: 24500000,
    imageUrl: '/src/assets/images/appliance_vacuum_cyclonic_1791362648079.jpg',
    leadTime: 'Giao nhanh 2h nội thành',
    stockCount: 29,
    warrantyMonths: 36,
    featuredPriority: 4,
    highlights: [
      'Cảm biến quang phổ phát hiện hạt bụi siêu mịn PM0.1 theo thời gian thực',
      'Thân vỏ nhôm Anodized nguyên khối kết hợp buồng lọc kính Sapphire chống trầy',
      'Trạm sạc tự động nén rác khử khuẩn UV-C trong 45 ngày không cần đổ bụi'
    ],
    specs: [
      { label: 'Động cơ kỹ thuật số', value: 'Hyper-Digital V12 · 140,000 RPM · 310 AW' },
      { label: 'Hệ thống lọc', value: 'HEPA H14 toàn phần · Giữ lại 99.997% hạt 0.1 micron' },
      { label: 'Độ ồn âm học', value: '56 dBA ở chế độ cân bằng (Buồng tiêu âm Helmholtz)' },
      { label: 'Pin Lithium-Silicon', value: '90 phút hoạt động liên tục · Thay pin 1 chạm' },
      { label: 'Vật liệu hoàn thiện', value: 'Nhôm Anodized phun cát mịn & Kính cường lực tối màu' }
    ],
    options: [
      {
        id: 'standard-dock',
        label: 'Bộ tiêu chuẩn + Trạm sạc đứng',
        priceDelta: 0,
        specSummary: 'Đầy đủ 5 đầu hút chuyên dụng cho sàn gỗ, thảm và khe hẹp'
      },
      {
        id: 'autocompact-uv',
        label: 'Trạm tự động thu gom bụi UV-C + 2 Pin',
        priceDelta: 5400000,
        specSummary: 'Tự động hút sạch khoang chứa và nhân đôi thời gian làm việc lên 180 phút'
      }
    ],
    architectureNote: 'Buồng tiêu âm Helmholtz · Lọc HEPA H14',
    efficiencyMetric: '99.997% tỉ lệ thu giữ hạt bụi siêu mịn 0.1 micron'
  },
  {
    id: 'aether-barista-core-e1',
    sku: 'ATH-HOME-BCE1',
    name: 'BaristaCore E1 Precision Espresso',
    subtitle:
      'Hệ thống chiết xuất cà phê áp suất biến thiên điều khiển bằng vi xử lý PID kép và cối xay gốm Titanium.',
    category: 'appliances',
    categoryLabel: 'Máy Móc Gia Dụng',
    basePrice: 36800000,
    imageUrl: '/src/assets/images/appliance_espresso_barista_1791363547447.jpg',
    leadTime: 'Giao hàng tiêu chuẩn 24h',
    stockCount: 14,
    warrantyMonths: 36,
    featuredPriority: 11,
    highlights: [
      'Kiểm soát nhiệt độ nước chiết xuất chuẩn xác ±0.1°C bằng cảm biến nhiệt bạch kim RTD',
      'Bơm từ trường tuyến tính lập trình được đồ thị áp suất từ 2 bar đến 11 bar',
      'Thân vỏ thép không gỉ 316L phay xước kết hợp nhôm Anodized đen mờ và bình thủy tinh khói'
    ],
    specs: [
      { label: 'Hệ thống gia nhiệt', value: 'Dual ThermoJet PID ±0.1°C (Làm nóng trong 2.8 giây)' },
      { label: 'Cối xay tích hợp', value: 'Lưỡi cắt hình nón Titanium 64mm · Cân điện tử 0.1g' },
      { label: 'Áp suất chiết xuất', value: 'Biến thiên chủ động 1–11 Bar theo hồ sơ hạt' },
      { label: 'Giao diện điều khiển', value: 'Màn hình tròn Sapphire OLED 2.4" & Vòng xoay CNC' },
      { label: 'Vật liệu khung vỏ', value: 'Thép 316L & Nhôm Anodized nguyên khối' }
    ],
    options: [
      {
        id: 'standalone-tank',
        label: 'Phiên bản Bình Nước Thủy Tinh Khói 2.4L',
        priceDelta: 0,
        specSummary: 'Linh hoạt đặt trên mọi mặt bàn đảo bếp đá tự nhiên'
      },
      {
        id: 'direct-plumb-kit',
        label: 'Tích hợp Cấp Nước Trực Tiếp & Bộ Lọc Khoáng RO',
        priceDelta: 4500000,
        specSummary: 'Tự động cấp nước có kiểm soát độ cứng TDS cho biệt thự & lounge'
      }
    ],
    architectureNote: 'Chuẩn nhiệt độ ±0.1°C · Bơm tuyến tính êm ái',
    efficiencyMetric: '2.8 giây khởi động tức thì không cần đun chờ'
  },
  {
    id: 'aether-hydro-sonic-w8',
    sku: 'ATH-HOME-HSW8',
    name: 'HydroSonic W8 Ultrasonic Dishwasher',
    subtitle:
      'Máy rửa chén âm tủ kết hợp sóng siêu âm đa tần 40kHz và sấy khô ngưng tụ Zeolite mặt trước Titanium phẳng.',
    category: 'appliances',
    categoryLabel: 'Máy Móc Gia Dụng',
    basePrice: 42900000,
    imageUrl: '/src/assets/images/appliance_dishwasher_sonic_1791363559923.jpg',
    leadTime: 'Khảo sát & lắp đặt âm tủ 48h',
    stockCount: 12,
    warrantyMonths: 36,
    featuredPriority: 12,
    highlights: [
      'Tạo hàng triệu bọt khí vi mô Cavitation làm sạch mảng bám mà không làm xước pha lê',
      'Tiêu thụ chỉ 5.8 lít nước mỗi chu trình cùng công nghệ sấy khoáng thạch Zeolite khô tuyệt đối',
      'Cửa Titanium phun cát mịn mở tự động bằng cảm biến gõ nhẹ và chiếu giờ LED xuống sàn'
    ],
    specs: [
      { label: 'Công nghệ làm sạch', value: 'Thủy lực biến tần + Sóng siêu âm 40kHz Cavitation' },
      { label: 'Lượng nước tiêu thụ', value: '5.8 Lít / Chu trình tiêu chuẩn (Tiết kiệm 48%)' },
      { label: 'Độ ồn vận hành', value: '36 dBA (Cách âm 3 lớp Bitumen & Bông khoáng)' },
      { label: 'Công nghệ sấy & Khử khuẩn', value: 'Sấy Zeolite tuần hoàn nhiệt + Tia cực tím UV-C' },
      { label: 'Kích thước lắp đặt', value: '598 × 550 × 815 mm (Chuẩn âm tủ châu Âu 14 bộ)' }
    ],
    options: [
      {
        id: 'titanium-matte',
        label: 'Mặt Cửa Titanium Xám Không Gian',
        priceDelta: 0,
        specSummary: 'Phủ lớp oleophobic chống bám vân tay tuyệt đối'
      },
      {
        id: 'custom-panel-kit',
        label: 'Phiên Bản Đồng Bộ Cánh Tủ Kiến Trúc + Bản Lề Trượt',
        priceDelta: 3200000,
        specSummary: 'Tùy biến hoàn toàn theo mặt đá hoặc gỗ của hệ tủ bếp cao cấp'
      }
    ],
    architectureNote: 'Sóng siêu âm 40kHz · Độ ồn 36 dBA',
    efficiencyMetric: '5.8 lít nước/lần rửa — Tiết kiệm 48% lượng nước sinh hoạt'
  },
  {
    id: 'aether-wardrobe-steam-v2',
    sku: 'ATH-HOME-AWV2',
    name: 'AeroWardrobe V2 Steam & UV-C Care',
    subtitle:
      'Tủ chăm sóc trang phục thông minh bằng hơi nước vi phân tử kết hợp sấy bơm nhiệt 38°C cho lụa và Cashmere.',
    category: 'appliances',
    categoryLabel: 'Máy Móc Gia Dụng',
    basePrice: 52500000,
    imageUrl: '/src/assets/images/appliance_steam_dresser_v2_1791366588128.jpg',
    leadTime: 'Giao hàng & lắp đặt 48h',
    stockCount: 8,
    warrantyMonths: 36,
    featuredPriority: 13,
    highlights: [
      'Móc treo dao động tần số âm thanh 180 nhịp/phút giũ phẳng nếp nhăn mà không cần bàn ủi',
      'Hệ thống sấy bơm nhiệt Dual-Inverter ở nhiệt độ thấp 38°C bảo vệ tuyệt đối sợi len lông cừu',
      'Cửa kính khói cường lực khung Titanium nguyên khối kiêm máy hút ẩm cho phòng thay đồ'
    ],
    specs: [
      { label: 'Công nghệ chăm sóc', value: 'Hơi nước Micro-Steam + Sấy HeatPump 38°C + UV-C' },
      { label: 'Độ ồn vận hành', value: '34 dBA (Chế độ ban đêm trong phòng ngủ Master)' },
      { label: 'Sức chứa tiêu chuẩn', value: '5 Áo khoác/Suit + 3 Quần âu + Kệ phụ kiện lụa' },
      { label: 'Khử mùi & Diệt khuẩn', value: '99.99% Vi khuẩn & Phân tử mùi khói/ẩm mốc' },
      { label: 'Kích thước tổng thể', value: '600 × 615 × 1960 mm · Kính khói & Titanium' }
    ],
    options: [
      {
        id: 'smoked-glass-titanium',
        label: 'Mặt Kính Khói & Khung Titanium Đen Mờ',
        priceDelta: 0,
        specSummary: 'Hòa quyện với hệ tủ áo cánh kính hiện đại'
      },
      {
        id: 'builtin-dehumidifier-pro',
        label: 'Tích hợp Mô-đun Hút Ẩm Phòng Walk-in Closet 24L/ngày',
        priceDelta: 6500000,
        specSummary: 'Bảo vệ toàn bộ túi da và đồng hồ trong phòng thay đồ khỏi nấm mốc'
      }
    ],
    architectureNote: 'Sấy HeatPump 38°C · Vận hành 34 dBA',
    efficiencyMetric: 'Giảm 85% tần suất phải giặt khô hóa chất độc hại'
  },
  {
    id: 'aether-thermoplate-s4',
    sku: 'ATH-HOME-TPS4',
    name: 'ThermoPlate S4 Precision Induction',
    subtitle:
      'Bếp từ ma trận đa điểm không viền lắp âm phẳng mặt đá, điều khiển bằng núm xoay từ tính CNC tháo rời.',
    category: 'appliances',
    categoryLabel: 'Máy Móc Gia Dụng',
    basePrice: 38900000,
    imageUrl: '/src/assets/images/appliance_induction_hob_s4_1791366602776.jpg',
    leadTime: 'Giao hàng & cắt đá lắp âm 24h',
    stockCount: 15,
    warrantyMonths: 36,
    featuredPriority: 14,
    highlights: [
      '48 cuộn cảm biến tần độc lập tự động nhận diện hình dáng nồi ở bất kỳ vị trí nào trên mặt kính',
      'Núm xoay cơ khí phay CNC từ thép không gỉ gắn nam châm lên mặt kính, nhấc ra để vệ sinh phẳng 100%',
      'Cảm biến hồng ngoại đo trực tiếp nhiệt độ đáy chảo chính xác tới ±0.5°C cho kỹ thuật Sous-Vide'
    ],
    specs: [
      { label: 'Cấu trúc mâm từ', value: '48 Cuộn cảm GaN High-Frequency đa vùng tự do' },
      { label: 'Tổng công suất', value: '7,400 W (Chế độ Boost 3,700 W trên vùng bất kỳ)' },
      { label: 'Kiểm soát nhiệt độ', value: 'Cảm biến hồng ngoại đáy nồi 35°C — 240°C (±0.5°C)' },
      { label: 'Mặt kính & Điều khiển', value: 'Schott Ceran Miradur chống trầy + Núm xoay từ tính CNC' },
      { label: 'Kích thước mặt bếp', value: '800 × 520 × 48 mm (Lắp âm phẳng Flush-Mount)' }
    ],
    options: [
      {
        id: 'hob-standard-dial',
        label: 'Bếp ThermoPlate S4 + 01 Núm Xoay Từ Tính CNC',
        priceDelta: 0,
        specSummary: 'Cấu hình tiêu chuẩn cho đảo bếp hiện đại'
      },
      {
        id: 'hob-probe-bundle',
        label: 'Kèm Nhiệt Kế Xiên Thịt Không Dây Bluetooth + Khay Teppanyaki',
        priceDelta: 4800000,
        specSummary: 'Tự động ngắt nhiệt khi tâm miếng Steak đạt đúng độ chín cài đặt'
      }
    ],
    architectureNote: '48 Cuộn cảm tự do · Núm xoay từ tính tháo rời',
    efficiencyMetric: 'Hiệu suất truyền nhiệt 94% — Mặt kính quanh nồi luôn mát'
  },

  // ==================== 3. LINH KIỆN CÔNG NGHIỆP (INDUSTRIAL - 6 ITEMS) ====================
  {
    id: 'aether-servo-hd90',
    sku: 'ATH-IND-HD90',
    name: 'HarmonicDrive X-90 Actuator & PLC',
    subtitle:
      'Cụm cơ cấu chấp hành Servo giảm tốc sóng hài tích hợp bộ điều khiển PLC bán dẫn cho cánh tay robot 6 trục.',
    category: 'industrial',
    categoryLabel: 'Linh Kiện Công Nghiệp',
    basePrice: 46800000,
    imageUrl: '/src/assets/images/industrial_servo_actuator_1791362671801.jpg',
    leadTime: 'Giao hàng 48h (Kèm chứng chỉ hiệu chuẩn)',
    stockCount: 24,
    warrantyMonths: 36,
    featuredPriority: 5,
    highlights: [
      'Độ rơ cơ khí bằng 0 (Zero-Backlash < 0.5 arcsec) với bánh răng thép hợp kim thấm nitơ',
      'Tích hợp sẵn bộ điều khiển EtherCAT chu kỳ 62.5 µs và cầu tản nhiệt ống đồng kép',
      'Bộ mã hóa quang học tuyệt đối 24-bit kép ở cả đầu vào và đầu ra'
    ],
    specs: [
      { label: 'Mô-men xoắn cực đại', value: '340 Nm · Tỉ số truyền 100:1' },
      { label: 'Độ chính xác lặp lại', value: '± 0.002 mm (0.4 arcsec)' },
      { label: 'Giao thức truyền thông', value: 'EtherCAT, PROFINET IRT, CANopen Safety' },
      { label: 'Điện áp & Công suất', value: '48V DC Bus · Hiệu suất chuyển đổi 96.4%' },
      { label: 'Tuổi thọ thiết kế (MTBF)', value: '45,000 giờ hoạt động liên tục ở tải định mức' }
    ],
    options: [
      {
        id: 'ratio-100',
        label: 'Tỉ số truyền 100:1 · Chuẩn IP65',
        priceDelta: 0,
        specSummary: 'Phù hợp cho robot lắp ráp điện tử và máy CNC 5 trục'
      },
      {
        id: 'ratio-160-cleanroom',
        label: 'Tỉ số truyền 160:1 · Chuẩn Phòng sạch ISO Class 3',
        priceDelta: 9200000,
        specSummary: 'Bôi trơn chân không chống phát tán hạt cho dây chuyền bán dẫn & y sinh'
      }
    ],
    architectureNote: 'EtherCAT 62.5 µs · Độ rơ < 0.5 arcsec',
    efficiencyMetric: '-38% điện năng tiêu thụ trên mỗi chu kỳ gắp đặt'
  },
  {
    id: 'aether-vision-lidar-m4',
    sku: 'ATH-IND-VLM4',
    name: 'OpticCore M4 Solid-State LiDAR & NPU',
    subtitle:
      'Cảm biến thị giác máy công nghiệp kết hợp LiDAR bán dẫn kiểm tra khuyết tật bề mặt ở tốc độ dây chuyền.',
    category: 'industrial',
    categoryLabel: 'Linh Kiện Công Nghiệp',
    basePrice: 54200000,
    imageUrl: '/src/assets/images/industrial_vision_sensor_1791362682505.jpg',
    leadTime: 'Giao hàng 48h (Hỗ trợ SDK C++ / Python)',
    stockCount: 19,
    warrantyMonths: 36,
    featuredPriority: 6,
    highlights: [
      'Quét 3D đám mây điểm độ sâu 1.2 micromet ở tốc độ 2,400 khung hình/giây',
      'Chip xử lý thần kinh tại biên (Edge NPU 68 TOPS) phân loại lỗi mối hàn trong 1.8 ms',
      'Thấu kính Sapphire nguyên khối kháng dầu cắt gọt, bụi kim loại chuẩn IP69K'
    ],
    specs: [
      { label: 'Độ phân giải chiều sâu Z', value: '1.2 µm · Tần số quét 2,400 Hz' },
      { label: 'Năng lực xử lý Edge AI', value: '68 TOPS INT8 · Suy luận nội tuyến < 1.8 ms' },
      { label: 'Cổng kết nối công nghiệp', value: '10GbE PoE++ (Đầu nối M12 X-Coded), Digital I/O cách ly' },
      { label: 'Nhiệt độ vận hành', value: '-25°C đến +70°C (Không cần quạt làm mát)' },
      { label: 'Cấp bảo vệ vỏ máy', value: 'IP69K · Nhôm hàng không Anodized cứng' }
    ],
    options: [
      {
        id: 'fov-narrow',
        label: 'Ống kính Macro Vi mạch (Trường nhìn 45×30 mm)',
        priceDelta: 0,
        specSummary: 'Kiểm tra bo mạch PCB, chân chip BGA và mối hàn laser'
      },
      {
        id: 'fov-wide',
        label: 'Ống kính Khổ rộng (Trường nhìn 400×300 mm)',
        priceDelta: 6500000,
        specSummary: 'Dẫn hướng cánh tay robot AGV và kiểm tra dung sai vỏ kim loại dập'
      }
    ],
    architectureNote: 'IP69K Kháng dầu áp lực cao · 68 TOPS NPU',
    efficiencyMetric: '99.98% độ chính xác phát hiện lỗi vi mạch ở 120 sản phẩm/phút'
  },
  {
    id: 'aether-cobot-a6',
    sku: 'ATH-IND-CBA6',
    name: 'AetherArm C6 Collaborative Robot',
    subtitle:
      'Cánh tay robot cộng tác 6 bậc tự do tích hợp cảm biến mô-men xoắn tại mọi khớp cho dây chuyền lắp ráp tinh vi.',
    category: 'industrial',
    categoryLabel: 'Linh Kiện Công Nghiệp',
    basePrice: 148000000,
    imageUrl: '/src/assets/images/industrial_cobot_arm_6axis_1791363583966.jpg',
    leadTime: 'Đặt hàng kỹ thuật 5–7 ngày',
    stockCount: 7,
    warrantyMonths: 36,
    featuredPriority: 15,
    highlights: [
      'Cảm biến lực/mô-men xoắn độ nhạy 0.05 N ở cả 6 khớp, dừng an toàn trong 0.8 ms khi chạm người',
      'Dạy học bằng thao tác kéo tay trực tiếp (Direct Teach) với giao diện mô phỏng 3D trên AetherBook',
      'Khung ống nhôm hàng không đúc rỗng siêu nhẹ 16.5 kg nhưng chịu tải định mức 7 kg'
    ],
    specs: [
      { label: 'Tải trọng & Tầm với', value: '7.0 kg tải liên tục · Bán kính vươn 910 mm' },
      { label: 'Độ lặp lại vị trí', value: '± 0.015 mm (ISO 9283)' },
      { label: 'Cảm biến an toàn khớp', value: '6× Strain-Gauge Torque Sensors · Chuẩn PLd Cat.3' },
      { label: 'Giao tiếp điều khiển', value: 'EtherCAT Master/Slave, Modbus TCP, ROS2 Native' },
      { label: 'Trọng lượng thân robot', value: '16.5 kg · Tiêu chuẩn phòng sạch ISO Class 4' }
    ],
    options: [
      {
        id: 'standard-arm-controller',
        label: 'Cánh Tay AetherArm C6 + Bộ Điều Khiển Tủ Rack',
        priceDelta: 0,
        specSummary: 'Bao gồm cáp chống nhiễu 5m và phanh điện từ an toàn trên cả 6 trục'
      },
      {
        id: 'vision-gripper-bundle',
        label: 'Tích hợp Tay Gắp Servo Lực Mềm + Camera Cổ Tay 3D',
        priceDelta: 24000000,
        specSummary: 'Giải pháp chìa khóa trao tay cho gắp đặt linh kiện bán dẫn và lắp ráp ốc vít'
      }
    ],
    architectureNote: 'Độ lặp lại ±0.015 mm · ROS2 & EtherCAT',
    efficiencyMetric: 'Hoàn vốn đầu tư tự động hóa trong 7.5 tháng vận hành 3 ca'
  },
  {
    id: 'aether-gan-drive-g800',
    sku: 'ATH-IND-G800',
    name: 'PowerCore G800 GaN Servo Inverter',
    subtitle:
      'Bộ biến tần điều khiển động cơ bán dẫn Gallium Nitride (GaN) tần số đóng cắt 200kHz với cổng quang EtherCAT.',
    category: 'industrial',
    categoryLabel: 'Linh Kiện Công Nghiệp',
    basePrice: 32500000,
    imageUrl: '/src/assets/images/industrial_gan_inverter_drive_1791363610259.jpg',
    leadTime: 'Có sẵn tại kho Hà Nội & TP.HCM',
    stockCount: 35,
    warrantyMonths: 36,
    featuredPriority: 16,
    highlights: [
      'Bán dẫn dải cấm rộng GaN giảm 72% tổn hao nhiệt đóng cắt so với IGBT silicon truyền thống',
      'Cổng truyền thông cáp quang chuẩn SFP+ miễn nhiễm hoàn toàn nhiễu điện từ trường (EMI) hồ quang',
      'Vỏ tản nhiệt vây nhôm phay CNC nguyên khối mật độ công suất cao, kích thước chỉ bằng 1/3 biến tần cũ'
    ],
    specs: [
      { label: 'Công suất định mức', value: '7.5 kW — 15 kW Peak · Điện áp 400V–800V DC Bus' },
      { label: 'Hiệu suất chuyển đổi', value: '99.1% (Tiêu chuẩn IE5 Ultra-Premium Efficiency)' },
      { label: 'Tần số điều chế PWM', value: '100 kHz — 200 kHz (Giảm nhiệt động cơ Servo 35%)' },
      { label: 'Truyền thông & An toàn', value: 'Dual Fiber-Optic EtherCAT · Safe Torque Off (SIL3)' },
      { label: 'Kích thước mô-đun', value: '185 × 85 × 64 mm · Thanh cái mạ vàng 24K' }
    ],
    options: [
      {
        id: '7kw-standard',
        label: 'Bản 7.5 kW Liên Tục · Tản Nhiệt Đối Lưu Tự Nhiên',
        priceDelta: 0,
        specSummary: 'Lắp đặt trực tiếp trên thanh DIN-Rail hoặc bảng đồng tủ điện'
      },
      {
        id: '15kw-coldplate',
        label: 'Bản 15 kW · Đế Làm Mát Chất Lỏng (Liquid Cold-Plate)',
        priceDelta: 6800000,
        specSummary: 'Dành cho máy cắt laser tốc độ cao và trục chính CNC 40,000 RPM'
      }
    ],
    architectureNote: 'Hiệu suất 99.1% GaN · Cổng quang chống nhiễu EMI',
    efficiencyMetric: '-72% tổn hao nhiệt trong tủ điện điều khiển trung tâm'
  },
  {
    id: 'aether-maglev-stage-m8',
    sku: 'ATH-IND-MLM8',
    name: 'MagLev M8 Linear Motor Stage',
    subtitle:
      'Bàn trượt tuyến tính đệm từ trường không ma sát kết hợp thước quang học nanomet cho máy quang khắc & kiểm tra wafer.',
    category: 'industrial',
    categoryLabel: 'Linh Kiện Công Nghiệp',
    basePrice: 76500000,
    imageUrl: '/src/assets/images/industrial_linear_stage_m8_1791366617809.jpg',
    leadTime: 'Đặt hàng kỹ thuật 3–5 ngày',
    stockCount: 10,
    warrantyMonths: 36,
    featuredPriority: 17,
    highlights: [
      'Truyền động trực tiếp không tiếp xúc cơ học (Zero Friction) loại bỏ hoàn toàn mài mòn và bụi kim loại',
      'Gia tốc cực đại 4.5 G và tốc độ di chuyển 3.2 m/s với độ phân giải thước quang Renishaw 5 nanomet',
      'Bệ trượt sợi Carbon đan chéo kết hợp ray hợp kim nhôm hàng không Anodized đen siêu phẳng'
    ],
    specs: [
      { label: 'Hành trình & Tốc độ', value: 'Hành trình 400 mm — 800 mm · Tốc độ 3.2 m/s · Gia tốc 4.5G' },
      { label: 'Độ lặp lại vị trí', value: '± 0.08 µm (80 nanomet) · Thước quang học tuyệt đối' },
      { label: 'Lực đẩy liên tục', value: '280 N liên tục · 850 N đỉnh' },
      { label: 'Vật liệu bàn trượt', value: 'Sợi Carbon Prepreg & Nhôm 7075-T6 phay chuẩn phẳng 1 µm' },
      { label: 'Môi trường vận hành', value: 'Phòng sạch ISO Class 2 / Chân không nhẹ' }
    ],
    options: [
      {
        id: 'stroke-400mm',
        label: 'Hành Trình 400 mm · Chuẩn Đơn Trục X',
        priceDelta: 0,
        specSummary: 'Ứng dụng cho máy cắt laser vi mạch và kiểm tra AOI tốc độ cao'
      },
      {
        id: 'stroke-xy-gantry',
        label: 'Hệ Bàn Chữ Thập Đôi X-Y (400 × 400 mm) Đồng Bộ',
        priceDelta: 42000000,
        specSummary: 'Hiệu chuẩn vuông góc bằng giao thoa kế laser sẵn sàng lắp đặt'
      }
    ],
    architectureNote: 'Độ lặp lại ±80 nanomet · Đệm từ không ma sát',
    efficiencyMetric: 'Tăng 210% năng suất gắp chip LED/Mini-LED trên mỗi giờ'
  },
  {
    id: 'aether-nexusedge-plc-tsn',
    sku: 'ATH-IND-NXT1',
    name: 'NexusEdge TSN Industrial PLC & AI Gateway',
    subtitle:
      'Bộ điều khiển PLC công nghiệp thời gian thực kết hợp cổng mạng nhạy thời gian TSN và vỏ Titanium tản nhiệt tĩnh.',
    category: 'industrial',
    categoryLabel: 'Linh Kiện Công Nghiệp',
    basePrice: 38400000,
    imageUrl: '/src/assets/images/industrial_edge_plc_gateway_1791366632381.jpg',
    leadTime: 'Có sẵn tại kho Hà Nội & TP.HCM',
    stockCount: 28,
    warrantyMonths: 60,
    featuredPriority: 18,
    highlights: [
      'Điều khiển đồng bộ tới 64 trục Servo qua mạng IEEE 802.1 Time-Sensitive Networking (TSN) với độ lệch < 100 ns',
      'Tích hợp màn hình chẩn đoán OLED trên mặt máy và 8 cổng M12 X-Coded mạ vàng chống rung lắc',
      'Vỏ vây Titanium nguyên khối làm mát thụ động 100%, hoạt động bền bỉ 10 năm trong môi trường khắc nghiệt'
    ],
    specs: [
      { label: 'Vi xử lý thời gian thực', value: 'Quad-Core ARM Cortex-R82 RTOS + 32 TOPS Edge NPU' },
      { label: 'Chu kỳ quét lệnh PLC', value: '12.5 µs (IEC 61131-3, C++, Python, OPC UA PubSub)' },
      { label: 'Cổng mạng công nghiệp', value: '8× 2.5GbE TSN / EtherCAT M12 X-Coded + 5G WWAN' },
      { label: 'Lưu trữ & Bảo mật', value: '512GB pSLC Industrial NVMe · Chip bảo mật phần cứng TPM 2.0' },
      { label: 'Nhiệt độ & Cấp bảo vệ', value: '-40°C đến +75°C · Chuẩn IP67 không quạt' }
    ],
    options: [
      {
        id: 'plc-64axis-standard',
        label: 'Bản Điều Khiển 64 Trục EtherCAT / TSN',
        priceDelta: 0,
        specSummary: 'Đầy đủ bản quyền Runtime IEC 61131-3 và giao thức OPC UA'
      },
      {
        id: 'plc-redundant-pair',
        label: 'Cặp Dự Phòng Kép Hot-Standby (Chuyển mạch 0 ms)',
        priceDelta: 34000000,
        specSummary: 'Đảm bảo dây chuyền luyện kim, hóa chất và bán dẫn không bao giờ dừng'
      }
    ],
    architectureNote: 'Chu kỳ 12.5 µs · 64 Trục TSN · Vỏ Titanium IP67',
    efficiencyMetric: 'Hợp nhất PLC, Motion Controller và AI Gateway vào 1 thiết bị duy nhất'
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-semicon-vn',
    index: '01',
    title: 'Tự động hóa kiểm tra quang học dây chuyền đóng gói bán dẫn',
    client: 'VinaSilicon Precision Assembly (Bắc Ninh)',
    role: 'Giám đốc Kỹ thuật Sản xuất',
    author: 'KS. Trần Minh Hoàng',
    category: 'Linh Kiện Công Nghiệp & Máy Trạm',
    metricValue: '-64%',
    metricUnit: 'Tỉ lệ dừng máy ngoài kế hoạch',
    timeframe: 'Trong 6 tháng vận hành liên tục (Q1–Q2/2026)',
    quote:
      'Trước khi chuyển sang cụm cảm biến OpticCore M4, bàn trượt từ trường MagLev M8 và cơ cấu HarmonicDrive X-90 của AETHER, dây chuyền của chúng tôi mất trung bình 14 giờ mỗi tháng để hiệu chuẩn lại độ rơ cơ khí. Hiện tại sai số giữ ổn định ở mức 80 nanomet.',
    outcomeSummary:
      'Triển khai 48 cụm cảm biến LiDAR M4, 16 bàn trượt MagLev M8 đồng bộ cùng máy chủ AetherBlade R2 tại phòng điều khiển.'
  },
  {
    id: 'cs-arch-residence',
    index: '02',
    title: 'Hệ thống kiểm soát vi khí hậu và gia dụng âm học cho biệt thự nghỉ dưỡng',
    client: 'Lumière Architectural Living (Đà Nẵng)',
    role: 'Kiến trúc sư trưởng',
    author: 'KTS. Nguyễn Thảo Nguyên',
    category: 'Máy Móc Gia Dụng Kiến Trúc',
    metricValue: '19.5 dBA',
    metricUnit: 'Độ ồn nền phòng ngủ tiêu chuẩn',
    timeframe: 'Khảo sát trên 120 căn biệt thự bàn giao năm 2026',
    quote:
      'Khách hàng cao cấp cực kỳ nhạy cảm với tiếng rít cơ học của thiết bị gia dụng truyền thống. Bộ sưu tập AtmosTower S1, AeroWardrobe V2, bếp từ ThermoPlate S4 và HydroSonic W8 hòa hợp tuyệt đối với bề mặt đá Travertine và giảm 41% điện năng tiêu thụ.',
    outcomeSummary:
      'Tích hợp đồng bộ 720 thiết bị gia dụng thông minh AETHER qua giao thức Matter nội bộ không phụ thuộc đám mây.'
  },
  {
    id: 'cs-auto-rnd',
    index: '03',
    title: 'Nâng cấp hạ tầng mô phỏng khí động học CFD cho trung tâm R&D ô tô điện',
    client: 'Apex Mobility Engineering (Hải Phòng)',
    role: 'Trưởng bộ phận Mô phỏng Khí động học',
    author: 'TS. Lê Quốc Bảo',
    category: 'Laptop & Máy Trạm Hiệu Năng Cao',
    metricValue: '3.4×',
    metricUnit: 'Tốc độ hội tụ lưới mô phỏng 3D',
    timeframe: 'So với hệ thống máy trạm để bàn năm 2025',
    quote:
      'Sự kết hợp giữa máy chủ AetherBlade R2, máy trạm AetherStudio Ultra 256GB và máy tính bảng AetherPad Studio 13 cho phép kỹ sư của chúng tôi quét LiDAR và nạp trực tiếp toàn bộ cụm chi tiết gầm xe 80 triệu đa giác ngay tại đường thử.',
    outcomeSummary:
      'Trang bị 60 tổ hợp AetherStudio Ultra + XDR 32 và 45 máy AetherBook Pro 16 cho đội ngũ kỹ sư thử nghiệm.'
  }
];

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
}
