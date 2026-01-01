/**
 * 车辆相关Mock数据
 */

// 车辆列表Mock数据
export const mockVehicleList = [
  {
    id: 1,
    name: '依维柯欧胜C型房车',
    type: 'C型',
    seats: 4,
    beds: 2,
    price: 680,
    image: 'https://placehold.co/400x300/FF9F29/FFFFFF?text=Vehicle1',
    tags: ['自动挡', '免费取消', '到店付'],
    storeId: 1,
    storeName: '北京朝阳门店',
    rating: 4.8,
    orderCount: 128
  },
  {
    id: 2,
    name: '大通V90 B型房车',
    type: 'B型',
    seats: 4,
    beds: 2,
    price: 580,
    image: 'https://placehold.co/400x300/2196F3/FFFFFF?text=Vehicle2',
    tags: ['自动挡', '免费取消'],
    storeId: 1,
    storeName: '北京朝阳门店',
    rating: 4.6,
    orderCount: 96
  }
];

// 车辆详情Mock数据
export const mockVehicleDetail = {
  id: 1,
  name: '依维柯欧胜C型房车',
  type: 'C型',
  seats: 4,
  beds: 2,
  price: 680,
  images: [
    'https://placehold.co/800x600/FF9F29/FFFFFF?text=Image1',
    'https://placehold.co/800x600/FF9F29/FFFFFF?text=Image2'
  ],
  specs: {
    length: '5.99米',
    width: '2.35米',
    height: '3.15米',
    weight: '3500kg',
    fuel: '柴油',
    transmission: '自动挡'
  },
  features: ['独立卫浴', '冷暖空调', '太阳能板', '外接电源'],
  description: '舒适宽敞的C型房车，适合家庭出游'
};
