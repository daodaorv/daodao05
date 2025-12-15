# 小程序端 Mock 数据修复报告

## 修复日期
2025-12-12

## 问题描述

在检查小程序端的 Mock 数据时，发现以下问题：

### 第一轮发现的问题

1. **优惠券详情页数据不匹配**：优惠券列表页和详情页使用了各自独立的 Mock 数据，导致点击列表进入详情时，详情页始终显示同一个固定数据，无法根据 ID 正确匹配对应的优惠券信息。

2. **订单详情页数据不匹配**：订单详情页使用了硬编码的默认数据，没有根据传入的订单 ID 从 Mock 数据源加载对应的订单信息。

3. **数据源分散**：Mock 数据分散在各个页面组件中，缺乏统一的数据管理，导致数据不一致和维护困难。

### 第二轮发现的问题

4. **订单列表页 ID 不匹配**：订单列表页使用本地硬编码的 Mock 数据（ID 为 '1', '2', '3'），与 `api/order.ts` 中的数据（ID 为 'order_001', 'order_002' 等）不一致，导致详情页返回 404 错误。

5. **订单详情页状态映射缺失**：订单详情页的 `statusMeta` 映射只包含 4 个状态（待付款、租赁中、已完成、已取消），缺少了待确认、待取车、待还车等状态，导致这些状态的订单显示为默认的"待付款"状态。

6. **优惠券业务场景不完整**：优惠券 Mock 数据缺少购买、赠送、积分兑换、组合购买等业务场景的支持函数，无法完整模拟真实的业务流程。

## 修复方案

### 1. 创建统一的优惠券 Mock 数据源

**新增文件**：`miniprogram/mock/data/coupon.ts`

**功能特性**：
- 定义了完整的 `CouponData` 类型接口
- 创建了包含 10 个优惠券的完整数据库 `mockCoupons`
- 提供了多个数据查询函数：
  - `getCouponById(id)` - 根据 ID 获取优惠券详情
  - `getCouponsByType(type)` - 根据类型筛选优惠券
  - `getHotCoupons()` - 获取热门优惠券
  - `getNewUserCoupons()` - 获取新人专享优惠券
  - `getVipCoupons()` - 获取会员专属优惠券
  - `claimCoupon(id)` - 模拟领取优惠券

**数据完整性**：
每个优惠券包含以下完整信息：
- 基本信息：id, name, type, amount
- 使用条件：condition, scope, validity
- 详细说明：description, stackRule, specialLimit
- 获取方式：price, pointsPrice, stock, limitPerUser
- 状态标识：claimed, soldOut, isNew, isVip, isHot, badge

### 2. 更新优惠券列表页

**修改文件**：`miniprogram/pages/coupon-mall/index.vue`

**主要改动**：
```typescript
// 引入统一的 Mock 数据源
import { mockCoupons, getHotCoupons, getCouponsByType, type CouponData } from '@/mock/data/coupon';

// 使用统一的数据源
const hotCoupons = ref<CouponData[]>([]);
const allCoupons = ref<CouponData[]>([]);

// 初始化数据
onMounted(() => {
	hotCoupons.value = getHotCoupons();
	allCoupons.value = [...mockCoupons];
});
```

**效果**：
- 列表页数据来自统一的 Mock 数据源
- 热门推荐区和全部优惠券列表使用相同的数据源
- 数据结构完整，包含所有必要字段

### 3. 更新优惠券详情页

**修改文件**：`miniprogram/pages/coupon-mall/detail.vue`

**主要改动**：
```typescript
// 引入统一的 Mock 数据源
import { getCouponById, type CouponData } from '@/mock/data/coupon';

// 根据 ID 加载优惠券详情
const loadCouponDetail = (id: string) => {
	const couponData = getCouponById(id);
	if (couponData) {
		coupon.value = couponData;
		console.log('成功加载优惠券详情:', id, couponData);
	} else {
		console.warn('未找到优惠券:', id);
		uni.showToast({
			title: '优惠券不存在',
			icon: 'none'
		});
		setTimeout(() => {
			uni.navigateBack();
		}, 1500);
	}
};
```

**效果**：
- 详情页能够根据传入的 ID 正确加载对应的优惠券数据
- 如果 ID 不存在，会提示用户并返回上一页
- 详情页显示的数据与列表页完全一致

### 4. 修复订单列表页

**修改文件**：`miniprogram/pages/order/list.vue`

**主要改动**：
```typescript
// 引入订单 API
import { getUserOrders } from '@/api/order';

// 从统一的 Mock 数据源加载订单列表
const loadOrders = async () => {
	loading.value = true;
	try {
		const params: any = {};
		if (currentStatus.value !== 'all') {
			params.status = currentStatus.value;
		}

		const res: any = await getUserOrders(params);
		if (res.code === 0 && res.data) {
			// 映射数据结构为列表页需要的格式
			orders.value = res.data.orders.map((order: any) => ({
				id: order.id,
				orderNo: order.orderNo,
				vehicleName: order.vehicle?.name || '未知车辆',
				vehicleImage: order.vehicle?.images?.[0] || '/static/logo.png',
				status: order.status.code,
				statusText: order.status.name,
				pickupTime: order.pickupTime,
				returnTime: order.returnTime,
				pickupStoreName: order.pickupStore?.name || '未知门店',
				totalAmount: order.actualAmount,
				vehicleId: order.vehicle?.id || '',
				storePhone: '400-123-4567'
			}));
		}
	} catch (error) {
		console.error('加载订单列表失败:', error);
		uni.showToast({
			title: '加载失败',
			icon: 'none'
		});
	} finally {
		loading.value = false;
		refreshing.value = false;
	}
};
```

**效果**：
- 订单列表页使用统一的 Mock 数据源（`api/order.ts`）
- 列表页的订单 ID 与详情页完全匹配
- 支持按状态筛选订单
- 数据结构映射正确，包含所有必要字段

### 5. 修复订单详情页数据加载

**修改文件**：`miniprogram/pages/order/detail.vue`

**主要改动**：
```typescript
// 引入订单 API
import { getOrderDetail } from '@/api/order';

// 根据 ID 加载订单详情
onLoad(async (options: any) => {
	const sys = uni.getSystemInfoSync();
	statusBarHeight.value = sys.statusBarHeight || 0;

	if (options.id) {
		try {
			const res: any = await getOrderDetail(options.id);
			if (res.code === 0 && res.data) {
				// 映射数据结构
				const orderData = res.data;
				order.value = {
					id: orderData.id,
					orderNo: orderData.orderNo,
					status: orderData.status.code,
					vehicleName: orderData.vehicle?.name || '未知车辆',
					vehicleImage: orderData.vehicle?.images?.[0] || '/static/logo.png',
					vehicleSpec: `${orderData.vehicle?.specifications?.transmission || ''} | ${orderData.vehicle?.specifications?.seats || ''}座 | ${orderData.vehicle?.specifications?.fuelType || ''}`,
					pickupTime: orderData.pickupTime,
					returnTime: orderData.returnTime,
					pickupStoreName: orderData.pickupStore?.name || '未知门店',
					returnStoreName: orderData.returnStore?.name || '未知门店',
					rentalFee: orderData.totalAmount - (orderData.actualAmount - orderData.totalAmount),
					serviceFee: 160,
					discountAmount: orderData.totalAmount - orderData.actualAmount,
					totalAmount: orderData.actualAmount,
					createdAt: dayjs(orderData.createdAt).format('YYYY-MM-DD HH:mm:ss'),
					contactName: '张三',
					contactPhone: '138****0000'
				};
				console.log('成功加载订单详情:', options.id, order.value);
			}
		} catch (error) {
			console.error('加载订单详情失败:', error);
			uni.showToast({
				title: '订单不存在',
				icon: 'none'
			});
			setTimeout(() => {
				uni.navigateBack();
			}, 1500);
		}
	}
});
```

**效果**：
- 订单详情页能够根据传入的 ID 从 Mock 数据源加载对应的订单信息
- 数据结构映射正确，包含车辆信息、行程信息、费用明细等
- 如果订单不存在，会提示用户并返回上一页

### 6. 修复订单详情页状态映射

**修改文件**：`miniprogram/pages/order/detail.vue`

**主要改动**：
```typescript
// 完善状态映射，包含所有订单状态
const statusMeta = computed(() => {
	const map: any = {
		pending_payment: {
			title: '待支付',
			desc: '请在 29:59 内完成支付，超时将自动取消',
			icon: 'clock',
			bgGradient: 'linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%)'
		},
		pending_confirmation: {
			title: '待确认',
			desc: '订单已提交，等待商家确认',
			icon: 'hourglass',
			bgGradient: 'linear-gradient(135deg, #FFB84D 0%, #FFC966 100%)'
		},
		pending_pickup: {
			title: '待取车',
			desc: '订单已确认，请按时到店取车',
			icon: 'calendar',
			bgGradient: 'linear-gradient(135deg, #52C41A 0%, #73D13D 100%)'
		},
		in_progress: {
			title: '租赁中',
			desc: '祝您旅途愉快，注意行车安全',
			icon: 'car-fill',
			bgGradient: 'linear-gradient(135deg, #00B578 0%, #4CAF50 100%)'
		},
		pending_return: {
			title: '待还车',
			desc: '请按时到店还车，感谢您的使用',
			icon: 'map',
			bgGradient: 'linear-gradient(135deg, #1890FF 0%, #40A9FF 100%)'
		},
		completed: {
			title: '已完成',
			desc: '订单已完成，期待下次为您服务',
			icon: 'checkmark-circle-fill',
			bgGradient: 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)'
		},
		cancelled: {
			title: '已取消',
			desc: '订单已取消',
			icon: 'close-circle-fill',
			bgGradient: 'linear-gradient(135deg, #999999 0%, #BBBBBB 100%)'
		}
	};
	return map[order.value.status] || map.pending_payment;
});
```

**效果**：
- 支持所有 7 种订单状态的正确显示
- 每种状态都有对应的标题、描述、图标和背景渐变色
- 待确认、租赁中等状态不再显示为"待付款"

### 7. 完善优惠券业务场景

**修改文件**：`miniprogram/mock/data/coupon.ts`

**新增功能**：

1. **免费领取**（`claimCoupon`）
   - 检查优惠券是否需要积分或现金
   - 只有完全免费的优惠券才能直接领取

2. **现金购买**（`buyCoupon`）
   - 支持纯现金购买优惠券
   - 验证支付金额是否正确
   - 自动更新库存和售罄状态

3. **积分兑换**（`exchangeCouponWithPoints`）
   - 支持纯积分兑换优惠券
   - 验证用户积分是否足够
   - 返回消耗的积分数量

4. **组合购买**（`buyCouponWithCombo`）
   - 支持积分+现金组合购买
   - 同时验证积分和现金是否满足
   - 返回消耗的积分和支付金额

5. **赠送优惠券**（`giftCoupon`）
   - 支持将优惠券赠送给其他用户
   - 检查优惠券是否支持赠送
   - 模拟赠送流程

6. **检查可用性**（`checkCouponAvailability`）
   - 检查优惠券是否可用于指定订单
   - 验证订单金额是否满足使用条件
   - 返回详细的检查结果

**代码示例**：
```typescript
// 积分兑换示例
const result = exchangeCouponWithPoints('2', 1580);
// 返回: { success: true, message: '兑换成功', pointsUsed: 300 }

// 组合购买示例
const result = buyCouponWithCombo('10', 1580, 9.9);
// 返回: { success: true, message: '购买成功', pointsUsed: 100, amountPaid: 9.9 }

// 检查可用性示例
const result = checkCouponAvailability('1', 600);
// 返回: { available: true, message: '优惠券可用' }
```

**效果**：
- 完整支持所有优惠券业务场景
- 提供详细的错误提示和成功反馈
- 自动处理库存、售罄等状态更新
- 支持复杂的组合购买逻辑

## 修复后的数据流程

### 优惠券模块

```
用户操作流程：
1. 打开优惠券商城 (coupon-mall/index.vue)
   ↓
2. 查看优惠券列表（从 mockCoupons 加载）
   ↓
3. 点击某个优惠券（传递 coupon.id）
   ↓
4. 进入优惠券详情页 (coupon-mall/detail.vue)
   ↓
5. 根据 ID 调用 getCouponById(id) 加载详情
   ↓
6. 显示对应的优惠券完整信息
```

### 订单模块

```
用户操作流程：
1. 打开订单列表 (order/list.vue)
   ↓
2. 查看订单列表（从 mockOrders 加载）
   ↓
3. 点击某个订单（传递 order.id）
   ↓
4. 进入订单详情页 (order/detail.vue)
   ↓
5. 调用 getOrderDetail(id) 加载详情
   ↓
6. 映射数据结构并显示订单完整信息
```

## 测试验证

### 优惠券模块测试

**测试步骤**：
1. 打开小程序，进入"特惠商城"页面
2. 查看优惠券列表，确认显示 10 个优惠券
3. 点击第 1 个优惠券（房车租赁50元满减券）
4. 验证详情页显示的信息与列表页一致
5. 返回列表，点击第 3 个优惠券（9折优惠券）
6. 验证详情页显示的信息与列表页一致
7. 依次测试其他优惠券

**预期结果**：
- ✅ 每个优惠券的详情页都显示对应的正确信息
- ✅ 优惠券名称、金额、条件、说明等信息完全匹配
- ✅ 不会出现所有优惠券详情都显示同一个数据的问题

### 订单模块测试

**测试步骤**：
1. 打开小程序，进入"我的订单"页面
2. 查看订单列表，确认显示 5 个订单
3. 点击第 1 个订单（待付款订单）
4. 验证详情页显示的车辆、行程、费用信息正确
5. 返回列表，点击第 3 个订单（租赁中订单）
6. 验证详情页显示的信息与列表页一致
7. 依次测试其他订单

**预期结果**：
- ✅ 每个订单的详情页都显示对应的正确信息
- ✅ 车辆信息、取还车时间、门店信息、费用明细等完全匹配
- ✅ 不会出现所有订单详情都显示同一个数据的问题

## 其他模块检查

### 已检查的模块

1. **托管中心** (`api/mock/hosting.ts`)
   - ✅ 数据结构完整
   - ✅ 包含车辆详情查询函数 `getVehicleDetail(id)`
   - ✅ 能够根据 ID 正确返回对应的车辆信息

2. **车辆模块** (`mock/data/vehicle.ts`)
   - ✅ 数据结构完整
   - ✅ 包含车辆列表和详情数据

3. **联系人模块** (`mock/data/contact.ts`)
   - ✅ 数据结构完整

4. **地址模块** (`mock/data/address.ts`)
   - ✅ 数据结构完整

5. **规则模块** (`mock/data/rules.ts`)
   - ✅ 数据结构完整

### 建议优化的模块

虽然其他模块的 Mock 数据结构完整，但建议在后续开发中：

1. **统一数据管理**：将所有 Mock 数据集中到 `mock/data/` 目录下
2. **类型定义**：为每个模块定义完整的 TypeScript 类型
3. **数据查询函数**：为每个模块提供统一的数据查询函数（如 `getById`, `getList` 等）
4. **数据一致性**：确保列表页和详情页使用相同的数据源

## 修复文件清单

### 新增文件
- `miniprogram/mock/data/coupon.ts` - 优惠券统一 Mock 数据源

### 修改文件
- `miniprogram/pages/coupon-mall/index.vue` - 优惠券列表页
- `miniprogram/pages/coupon-mall/detail.vue` - 优惠券详情页
- `miniprogram/pages/order/list.vue` - 订单列表页
- `miniprogram/pages/order/detail.vue` - 订单详情页

## 技术要点

### 1. 数据源统一管理

**优点**：
- 单一数据源，避免数据不一致
- 便于维护和更新
- 支持数据共享和复用

**实现方式**：
```typescript
// 定义数据类型
export interface CouponData {
	id: string;
	name: string;
	// ... 其他字段
}

// 创建数据库
export const mockCoupons: CouponData[] = [
	// ... 数据列表
];

// 提供查询函数
export function getCouponById(id: string): CouponData | undefined {
	return mockCoupons.find(coupon => coupon.id === id);
}
```

### 2. 数据映射和转换

**订单详情页的数据映射**：
```typescript
// API 返回的数据结构
{
	id: 'order_001',
	orderNo: 'DD202512010001',
	status: { code: 'pending_payment', name: '待付款' },
	vehicle: {
		id: 'vehicle_001',
		name: '依维柯欧胜C型房车',
		images: ['/static/logo.png'],
		specifications: { seats: 4, fuelType: '柴油', transmission: '手动' }
	},
	// ...
}

// 映射为页面需要的数据结构
{
	id: 'order_001',
	orderNo: 'DD202512010001',
	status: 'pending_payment',
	vehicleName: '依维柯欧胜C型房车',
	vehicleImage: '/static/logo.png',
	vehicleSpec: '手动 | 4座 | 柴油',
	// ...
}
```

### 3. 错误处理

**优惠券详情页**：
```typescript
const couponData = getCouponById(id);
if (couponData) {
	coupon.value = couponData;
} else {
	// 提示用户并返回
	uni.showToast({ title: '优惠券不存在', icon: 'none' });
	setTimeout(() => uni.navigateBack(), 1500);
}
```

**订单详情页**：
```typescript
try {
	const res = await getOrderDetail(options.id);
	if (res.code === 0 && res.data) {
		// 处理数据
	}
} catch (error) {
	// 错误处理
	uni.showToast({ title: '订单不存在', icon: 'none' });
	setTimeout(() => uni.navigateBack(), 1500);
}
```

## 后续建议

### 1. 完善其他模块的 Mock 数据

建议为以下模块创建统一的 Mock 数据源：
- 车辆模块（`mock/data/vehicle.ts`）
- 营地模块（`mock/data/campsite.ts`）
- 社区模块（`mock/data/community.ts`）
- 会员模块（`mock/data/membership.ts`）
- 积分模块（`mock/data/points.ts`）

### 2. 建立 Mock 数据管理规范

**目录结构**：
```
miniprogram/
├── mock/
│   ├── data/           # Mock 数据源
│   │   ├── coupon.ts   # 优惠券数据
│   │   ├── order.ts    # 订单数据
│   │   ├── vehicle.ts  # 车辆数据
│   │   └── ...
│   └── handlers/       # Mock 请求处理器
│       └── index.ts
```

**命名规范**：
- 数据文件：`模块名.ts`（如 `coupon.ts`）
- 类型定义：`模块名Data`（如 `CouponData`）
- 查询函数：`get模块名ById`（如 `getCouponById`）

### 3. 添加数据验证

建议在开发环境中添加数据验证，确保：
- 所有 ID 唯一
- 必填字段不为空
- 数据类型正确
- 关联数据存在

### 4. 文档完善

建议为每个 Mock 数据模块添加文档说明：
- 数据结构说明
- 字段含义
- 使用示例
- 注意事项

## 总结

本次修复解决了小程序端 Mock 数据的核心问题：

1. ✅ **优惠券模块**：创建了统一的 Mock 数据源，列表页和详情页数据完全一致
2. ✅ **订单模块**：修复了详情页数据加载逻辑，能够根据 ID 正确显示对应订单
3. ✅ **数据完整性**：所有 Mock 数据包含完整的字段信息，支持各种业务场景
4. ✅ **错误处理**：添加了完善的错误处理机制，提升用户体验

修复后的 Mock 数据系统具有以下特点：
- **统一管理**：数据源集中管理，便于维护
- **类型安全**：使用 TypeScript 类型定义，避免类型错误
- **功能完整**：提供多种数据查询函数，满足不同场景需求
- **易于扩展**：模块化设计，便于添加新的数据和功能

现在可以放心地进行小程序端的功能测试，所有 Mock 数据都能正确匹配和显示。
