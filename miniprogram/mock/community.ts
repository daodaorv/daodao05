/**
 * 社区相关Mock数据
 */

// 社区分类
export const mockCommunityCategories = [
  { id: 'all', name: '全部' },
  { id: 'travel', name: '旅行日记' },
  { id: 'guide', name: '攻略分享' },
  { id: 'equipment', name: '装备测评' },
  { id: 'camping', name: '露营生活' },
  { id: 'food', name: '美食推荐' }
];

// 社区帖子列表（首页精选）
export const mockCommunityPosts = [
  {
    id: '1',
    cover: '/static/场景推荐2.jpg',
    title: '我们最爱的海滨营地，拥有绝美海景的完美度假地',
    description: '拥有绝美海景的完美度假地。',
    author: '旅行一家人',
    userName: '旅行一家人',
    userAvatar: '/static/default-avatar.png',
    likes: '1.2k',
    likeCount: 1200,
    image: '/static/场景推荐2.jpg'
  },
  {
    id: '2',
    cover: '/static/优惠政策.jpg',
    title: '优胜美地周末游，充分利用国家公园之旅的小贴士',
    description: '充分利用国家公园之旅的小贴士。',
    author: '冒险家',
    userName: '冒险家',
    userAvatar: '/static/default-avatar.png',
    likes: '980',
    likeCount: 980,
    image: '/static/优惠政策.jpg'
  },
  {
    id: '3',
    cover: '/static/场景推荐2.jpg',
    title: '房车露营初体验，第一次租房车需要注意什么？',
    description: '第一次租房车需要注意什么？',
    author: '新手上路',
    userName: '新手上路',
    userAvatar: '/static/default-avatar.png',
    likes: '560',
    likeCount: 560,
    image: '/static/场景推荐2.jpg'
  },
  {
    id: '4',
    cover: '/static/优惠政策.jpg',
    title: '川西小环线攻略，7天6晚，感受高原的魅力',
    description: '7天6晚，感受高原的魅力。',
    author: '自驾达人',
    userName: '自驾达人',
    userAvatar: '/static/default-avatar.png',
    likes: '2.3k',
    likeCount: 2300,
    image: '/static/优惠政策.jpg'
  }
];
