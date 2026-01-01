import { Request, Response } from 'express';
import { OperationLogDAO } from '@dao/operation-log.dao';
import { QueryBuilder } from '@db/query-builder';
import { successResponse, errorResponse } from '@utils/response';
import { logger } from '@utils/logger';


/**
 * 操作日志控制器
 */
export class OperationLogController {
  private operationLogDAO: OperationLogDAO;

  constructor() {
    this.operationLogDAO = new OperationLogDAO();
  }

  /**
   * 获取操作日志列表
   * GET /api/v1/operation-logs
   */
  async getOperationLogList(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        pageSize = 10,
        operator,
        module,
        action,
        startDate,
        endDate,
      } = req.query;

      // 构建查询条件
      const conditions: string[] = [];
      const params: any[] = [];

      if (operator) {
        conditions.push('operator LIKE ?');
        params.push(`%${operator}%`);
      }

      if (module) {
        conditions.push('module = ?');
        params.push(module);
      }

      if (action) {
        conditions.push('action = ?');
        params.push(action);
      }

      if (startDate) {
        conditions.push('created_at >= ?');
        params.push(startDate);
      }

      if (endDate) {
        conditions.push('created_at <= ?');
        params.push(endDate);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      // 查询总数
      const countSql = `SELECT COUNT(*) as total FROM operation_logs ${whereClause}`;
      const countResult = await QueryBuilder.queryOne(countSql, params);
      const total = (countResult as any)?.total || 0;

      // 查询列表
      const offset = (Number(page) - 1) * Number(pageSize);
      const listSql = `
        SELECT * FROM operation_logs
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `;
      const list = await QueryBuilder.query(listSql, [...params, Number(pageSize), offset]);

      res.json(
        successResponse({
          list,
          total,
          page: Number(page),
          pageSize: Number(pageSize),
        })
      );
    } catch (error) {
      logger.error('获取操作日志列表失败:', error);
      res.status(500).json(errorResponse('获取操作日志列表失败', 500));
    }
  }

  /**
   * 获取操作日志详情
   * GET /api/v1/operation-logs/:id
   */
  async getOperationLogDetail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const log = await this.operationLogDAO.findById(Number(id));

      if (!log) {
        res.status(404).json(errorResponse('操作日志不存在', 404));
        return;
      }

      res.json(successResponse(log));
    } catch (error) {
      logger.error('获取操作日志详情失败:', error);
      res.status(500).json(errorResponse('获取操作日志详情失败', 500));
    }
  }

  /**
   * 导出操作日志
   * POST /api/v1/operation-logs/export
   */
  async exportOperationLogs(_req: Request, res: Response): Promise<void> {
    try {
      // TODO: 实现导出功能
      res.json(successResponse({ message: '导出功能开发中' }));
    } catch (error) {
      logger.error('导出操作日志失败:', error);
      res.status(500).json(errorResponse('导出操作日志失败', 500));
    }
  }

  /**
   * 清理操作日志
   * DELETE /api/v1/operation-logs/clean
   */
  async cleanOperationLogs(req: Request, res: Response): Promise<void> {
    try {
      const { beforeDate } = req.body;

      if (!beforeDate) {
        res.status(400).json(errorResponse('清理日期不能为空', 400));
        return;
      }

      const deletedCount = await this.operationLogDAO.cleanBeforeDate(beforeDate);
      res.json(successResponse({ deletedCount, message: `已清理 ${deletedCount} 条日志` }));
    } catch (error) {
      logger.error('清理操作日志失败:', error);
      res.status(500).json(errorResponse('清理操作日志失败', 500));
    }
  }
}
