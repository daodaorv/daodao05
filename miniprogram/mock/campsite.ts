/**
 * 营地相关Mock数据
 */

// 营地列表（从pages/campsite/list.vue迁移）
export const mockCampsiteList = [
  {
    id: '1',
    name: '千岛湖房车营地',
    image: 'https://placehold.co/350x200/8BC34A/FFFFFF?text=%E8%90%A5%E5%9C%B01',
    tags: ['湖景', '烧烤', 'WiFi'],
    rating: 4.8,
    reviewCount: 156,
    distance: 5.2,
    price: 280,
    availableSites: 8,
    isHot: true
  },
  {
    id: '2',
    name: '莫干山森林营地',
    image: 'https://placehold.co/350x200/4CAF50/FFFFFF?text=%E8%90%A5%E5%9C%B02',
    tags: ['山景', '徒步', '儿童乐园'],
    rating: 4.9,
    reviewCount: 203,
    distance: 12.8,
    price: 350,
    availableSites: 5,
    isHot: true
  },
  {
    id: '3',
    name: '海宁海滨营地',
    image: 'https://placehold.co/350x200/03A9F4/FFFFFF?text=%E8%90%A5%E5%9C%B03',
    tags: ['海景', '沙滩', '观潮'],
    rating: 4.7,
    reviewCount: 89,
    distance: 35.6,
    price: 320,
    availableSites: 12,
    isHot: false
  },
  {
    id: '4',
    name: '西湖山谷营地',
    image: 'https://placehold.co/350x200/009688/FFFFFF?text=%E8%90%A5%E5%9C%B04',
    tags: ['山谷', '溪流', '垂钓'],
    rating: 4.6,
    reviewCount: 67,
    distance: 8.5,
    price: 260,
    availableSites: 15,
    isHot: false
  },
  {
    id: '5',
    name: '天目山生态营地',
    image: 'https://placehold.co/350x200/9C27B0/FFFFFF?text=%E8%90%A5%E5%9C%B05',
    tags: ['生态', '温泉', '观星'],
    rating: 4.9,
    reviewCount: 178,
    distance: 45.3,
    price: 420,
    availableSites: 6,
    isHot: true
  },
  {
    id: '6',
    name: '富春江畔营地',
    image: 'https://placehold.co/350x200/FF9800/FFFFFF?text=%E8%90%A5%E5%9C%B06',
    tags: ['江景', '骑行', '露营'],
    rating: 4.5,
    reviewCount: 92,
    distance: 28.7,
    price: 300,
    availableSites: 10,
    isHot: false
  }
];

// 营地预订须知（从pages/campsite/booking.vue迁移）
export const mockBookingNotices = [
  '入住时间：14:00后，退房时间：12:00前',
  '预订需支付全额费用，不支持到店付款',
  '如需取消，请提前3天申请，否则不予退款',
  '请携带有效身份证件办理入住手续',
  '营地内禁止明火，烧烤请在指定区域进行',
  '请爱护营地环境，垃圾分类投放'
];

// 保险方案
export const mockInsurancePlans = [
  {
    id: 'basic',
    name: '基础意外险',
    price: 20,
    description: '旅途意外、行李延误、医疗补偿，适合短住露营',
    perPerson: true
  },
  {
    id: 'plus',
    name: '家庭露营险',
    price: 60,
    description: '覆盖家庭成员，包含儿童受伤医疗和营地财物保障',
    perPerson: false
  },
  {
    id: 'extreme',
    name: '极限活动险',
    price: 120,
    description: '增加户外运动、夜间活动的意外赔付，含紧急救援',
    perPerson: true
  }
];
