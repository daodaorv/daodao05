import { Router } from 'express';
import healthRoutes from './v1/health.routes';
import authRoutes from './v1/auth.routes';
import userRoutes from './v1/user.routes';
import roleRoutes from './v1/role.routes';
// 暂时注释以下路由，待修复类型错误后再启用
// import storeRoutes from './v1/store.routes';
import vehicleRoutes from './v1/vehicle.routes';
import orderRoutes from './v1/order.routes';
// import paymentRoutes from './v1/payment.routes';
// import specialOfferRoutes from './v1/special-offer.routes';
// import campsiteRoutes from './v1/campsite.routes';
// import tourRoutes from './v1/tour.routes';
// import hostingRoutes from './v1/hosting.routes';
// import couponRoutes from './v1/coupon.routes';
// import crowdfundingRoutes from './v1/crowdfunding.routes';
// import notificationRoutes from './v1/notification.routes';
// import communityRoutes from './v1/community.routes';
// import pointsRoutes from './v1/points.routes';
// import membershipRoutes from './v1/membership.routes';
// import ratingRoutes from './v1/rating.routes';
// import helpRoutes from './v1/help.routes';
// import walletRoutes from './v1/wallet.routes';
import contactRoutes from './v1/contact.routes';
import rulesRoutes from './v1/rules.routes';

const router = Router();

// 挂载v1版本路由 - 仅保留核心用户相关路由用于联调
router.use('/v1/health', healthRoutes);
router.use('/v1/auth', authRoutes);
router.use('/v1/users', userRoutes);
router.use('/v1/roles', roleRoutes);
// router.use('/v1/stores', storeRoutes);
router.use('/v1/vehicles', vehicleRoutes);
router.use('/v1/orders', orderRoutes);
// router.use('/v1/payments', paymentRoutes);
// router.use('/v1/special-offers', specialOfferRoutes);
// router.use('/v1/campsites', campsiteRoutes);
// router.use('/v1/tours', tourRoutes);
// router.use('/v1/hosting', hostingRoutes);
// router.use('/v1/coupons', couponRoutes);
// router.use('/v1/crowdfunding', crowdfundingRoutes);
// router.use('/v1/notifications', notificationRoutes);
// router.use('/v1/community', communityRoutes);
// router.use('/v1/points', pointsRoutes);
// router.use('/v1/membership', membershipRoutes);
// router.use('/v1/ratings', ratingRoutes);
// router.use('/v1/help', helpRoutes);
// router.use('/v1/wallet', walletRoutes);
router.use('/v1/contacts', contactRoutes);
router.use('/v1/rules', rulesRoutes);

export default router;
