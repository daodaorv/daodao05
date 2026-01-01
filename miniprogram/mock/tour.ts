/**
 * 旅游线路相关Mock数据
 */

// 旅游线路列表（从pages/tour/list.vue迁移）
export const mockTourList = [
  {
    id: '1',
    title: '川西秘境·稻城亚丁房车深度游',
    image: 'https://placehold.co/700x400/FF5722/FFFFFF?text=%E7%BA%BF%E8%B7%AF1',
    tags: ['高原风光', '摄影天堂', '藏族文化'],
    days: 7,
    minPeople: 5,
    maxPeople: 12,
    currentPeople: 8,
    price: 4980,
    childPrice: 2490,
    status: 'recruiting',
    isHot: true,
    available: 4
  },
  {
    id: '2',
    title: '大西北环线·青海湖敦煌房车之旅',
    image: 'https://placehold.co/700x400/3F51B5/FFFFFF?text=%E7%BA%BF%E8%B7%AF2',
    tags: ['大漠风光', '丝绸之路', '星空露营'],
    days: 8,
    minPeople: 5,
    maxPeople: 10,
    currentPeople: 10,
    price: 5680,
    childPrice: 2840,
    status: 'confirmed',
    isHot: true,
    available: 0
  },
  {
    id: '3',
    title: '云南秘境·香格里拉梅里雪山行',
    image: 'https://placehold.co/700x400/607D8B/FFFFFF?text=%E7%BA%BF%E8%B7%AF3',
    tags: ['雪山风光', '藏区文化', '徒步探险'],
    days: 6,
    minPeople: 5,
    maxPeople: 12,
    currentPeople: 6,
    price: 4280,
    childPrice: 2140,
    status: 'recruiting',
    isHot: false,
    available: 6
  },
  {
    id: '4',
    title: '新疆伊犁·天山草原房车自驾',
    image: 'https://placehold.co/700x400/4CAF50/FFFFFF?text=%E7%BA%BF%E8%B7%AF4',
    tags: ['草原风光', '哈萨克文化', '野生动物'],
    days: 9,
    minPeople: 5,
    maxPeople: 15,
    currentPeople: 3,
    price: 6280,
    childPrice: 3140,
    status: 'recruiting',
    isHot: false,
    available: 12
  },
  {
    id: '5',
    title: '内蒙古草原·呼伦贝尔房车穿越',
    image: 'https://placehold.co/700x400/795548/FFFFFF?text=%E7%BA%BF%E8%B7%AF5',
    tags: ['大草原', '蒙古文化', '骑马体验'],
    days: 5,
    minPeople: 5,
    maxPeople: 12,
    currentPeople: 12,
    price: 3680,
    childPrice: 1840,
    status: 'departed',
    isHot: false,
    available: 0
  }
];

// 旅游线路详情（从pages/tour/detail.vue迁移）
export const mockTourDetail = {
  id: '1',
  title: '川西秘境·稻城亚丁房车深度游',
  images: [
    '/static/logo.png',
    '/static/logo.png',
    '/static/logo.png',
    '/static/logo.png'
  ],
  tags: ['高原风光', '摄影天堂', '藏族文化', '深度体验'],
  duration: 7,
  minPeople: 5,
  maxPeople: 12,
  destination: '四川·稻城亚丁',
  pricePerPerson: 4980,
  childPrice: 2490,
  isHot: true,
  announcement: '【行程提醒】本线路为高原地区旅行，海拔最高达4700米，请提前做好身体准备。12月15日批次即将成团，仅剩4个名额。出发前7天确认成团，未成团全额退款。建议购买高原旅游保险，携带防寒衣物和常用药品。',
  batches: [
    {
      id: '1',
      departureDate: '2025-12-15',
      status: 'recruiting',
      currentPeople: 8,
      maxPeople: 12
    },
    {
      id: '2',
      departureDate: '2025-12-22',
      status: 'recruiting',
      currentPeople: 3,
      maxPeople: 12
    },
    {
      id: '3',
      departureDate: '2026-01-05',
      status: 'recruiting',
      currentPeople: 5,
      maxPeople: 12
    },
    {
      id: '4',
      departureDate: '2025-12-08',
      status: 'confirmed',
      currentPeople: 12,
      maxPeople: 12
    }
  ],
  itinerary: [
    {
      title: '成都集合',
      content: '全天成都集合，入住酒店。可自由活动，品尝成都美食，游览宽窄巷子、锦里等景点。',
      highlights: ['成都美食', '自由活动']
    },
    {
      title: '成都 - 新都桥',
      content: '早餐后出发，经雅安、泸定，翻越折多山（海拔4298米），抵达摄影天堂新都桥。沿途欣赏大渡河峡谷风光、泸定桥、折多山云海。',
      highlights: ['泸定桥', '折多山', '新都桥']
    },
    {
      title: '新都桥 - 稻城',
      content: '早起拍摄新都桥晨曦，后经雅江、理塘，抵达稻城县。途经高尔寺山、剪子弯山、卡子拉山、海子山，欣赏高原风光。',
      highlights: ['新都桥晨曦', '理塘', '海子山']
    },
    {
      title: '稻城 - 亚丁',
      content: '前往亚丁景区，游览冲古寺、珍珠海、仙乃日神山。下午自由活动，可选择徒步或骑马游览。',
      highlights: ['亚丁景区', '仙乃日', '珍珠海']
    },
    {
      title: '亚丁深度游',
      content: '全天深度游览亚丁景区，徒步洛绒牛场、牛奶海、五色海。欣赏央迈勇、夏诺多吉神山。',
      highlights: ['牛奶海', '五色海', '三神山']
    },
    {
      title: '亚丁 - 新都桥',
      content: '早起拍摄亚丁晨曦，后返回新都桥。途经理塘、雅江，欣赏沿途风光。',
      highlights: ['亚丁晨曦', '返程风光']
    },
    {
      title: '新都桥 - 成都',
      content: '早餐后返回成都，结束愉快的川西之旅。预计下午抵达成都，可根据返程时间安排。',
      highlights: ['返回成都', '行程结束']
    }
  ],
  priceIncludes: [
    '全程房车使用费（含油费、过路费）',
    '6晚住宿（房车营地或酒店）',
    '全程早餐',
    '专业领队服务',
    '景区门票（亚丁景区）',
    '旅游意外保险',
    '对讲机使用',
    '24小时道路救援'
  ],
  priceExcludes: [
    '往返成都大交通',
    '午餐和晚餐',
    '景区内观光车、索道等费用',
    '个人消费及自费项目',
    '单房差（如需单独住宿）',
    '因不可抗力产生的额外费用'
  ],
  bookingNotices: [
    '本线路为成团产品，最少5人成团，最多12人',
    '出发前7天确认是否成团，未成团全额退款',
    '高原地区，请提前做好身体准备，有高血压、心脏病等疾病者不宜参加',
    '行程中如遇天气、路况等不可抗力因素，领队有权调整行程',
    '请携带身份证、驾驶证等有效证件',
    '建议购买高原旅游保险',
    '儿童价格适用于12岁以下，不占床位'
  ],
  cancellationPolicy: [
    { condition: '出发前7天以上取消', result: '全额退款' },
    { condition: '出发前3-7天取消', result: '退款70%' },
    { condition: '出发前1-3天取消', result: '退款30%' },
    { condition: '出发当天取消', result: '不予退款' }
  ]
};

// 旅游预订页Mock数据（从pages/tour/booking.vue迁移）
export const mockTourBooking = {
  id: '1',
  title: '川西秘境·稻城亚丁房车深度游',
  duration: 7,
  minPeople: 5,
  maxPeople: 12,
  pricePerPerson: 4980,
  childPrice: 2490
};

export const mockTourBatch = {
  id: '1',
  departureDate: '2025-12-15',
  currentPeople: 8,
  maxPeople: 12
};
