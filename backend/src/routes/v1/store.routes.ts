import { Router, Request, Response } from 'express';
import { StoreDAO } from '@dao/store.dao';
import { CityDAO } from '@dao/city.dao';
import { successResponse, errorResponse } from '@utils/response';
import { logger } from '@utils/logger';

const router = Router();
const storeDAO = new StoreDAO();
const cityDAO = new CityDAO();

/**
 * 1. 获取城市列表
 * GET /api/v1/stores/cities
 */
router.get('/cities', async (_req: Request, res: Response) => {
  try {
    const cities = await cityDAO.findAllCities();

    res.json(successResponse(cities));
  } catch (error) {
    logger.error('获取城市列表失败:', error);
    res.status(500).json(errorResponse('获取城市列表失败', 500));
  }
});

/**
 * 2. 获取门店列表
 * GET /api/v1/stores
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { cityId } = req.query;

    if (!cityId) {
      res.status(400).json(errorResponse('城市ID不能为空', 400));
      return;
    }

    // 根据cityId获取城市名称
    const cityName = String(cityId).replace('city_', '');
    const stores = await storeDAO.findByCity(cityName);

    res.json(
      successResponse({
        list: stores.map((store) => ({
          id: `store_${store.id}`,
          cityId,
          name: store.name,
          address: store.address,
          phone: store.contact_phone,
          latitude: store.location_lat,
          longitude: store.location_lng,
          businessHours: store.business_hours || '09:00-18:00',
          vehicleCount: 0, // TODO: 从车辆表统计
          rating: 4.8, // TODO: 从评价表统计
          reviewCount: 0, // TODO: 从评价表统计
          images: store.images || [],
          facilities: store.services || [],
          isRecommended: store.sort_order > 0,
        })),
        total: stores.length,
      })
    );
  } catch (error) {
    logger.error('获取门店列表失败:', error);
    res.status(500).json(errorResponse('获取门店列表失败', 500));
  }
});

/**
 * 3. 获取门店详情
 * GET /api/v1/stores/:id
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 从store_xxx格式中提取数字ID
    const storeId = parseInt(id.replace('store_', ''));
    if (isNaN(storeId)) {
      res.status(400).json(errorResponse('门店ID格式错误', 400));
      return;
    }

    const store = await storeDAO.findById(storeId);
    if (!store) {
      res.status(404).json(errorResponse('门店不存在', 404));
      return;
    }

    res.json(
      successResponse({
        id: `store_${store.id}`,
        cityId: `city_${store.city}`,
        name: store.name,
        address: store.address,
        phone: store.contact_phone,
        latitude: store.location_lat,
        longitude: store.location_lng,
        businessHours: store.business_hours || '09:00-18:00',
        vehicleCount: 0, // TODO: 从车辆表统计
        rating: 4.8, // TODO: 从评价表统计
        reviewCount: 0, // TODO: 从评价表统计
        images: store.images || [],
        facilities: store.services || [],
        isRecommended: store.sort_order > 0,
        description: store.description || '',
        openingDate: store.created_at,
        manager: store.contact_person || '',
        services: store.services || [],
      })
    );
  } catch (error) {
    logger.error('获取门店详情失败:', error);
    res.status(500).json(errorResponse('获取门店详情失败', 500));
  }
});

export default router;
