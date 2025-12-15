/**
 * 工作台相关Mock数据
 */

/**
 * 获取工作台数据概览
 */
export function getOverview() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        todayOrders: {
          total: 28,
          pending: 5,
          confirmed: 12,
          completed: 11
        },
        activeUsers: {
          total: 156,
          new: 12,
          active: 89
        },
        revenue: {
          today: 45680,
          month: 1234567,
          growth: 15.8
        },
        vehicles: {
          total: 45,
          available: 23,
          rented: 18,
          maintenance: 4
        }
      })
    }, 500)
  })
}

/**
 * 获取待办任务列表
 */
export function getTodoList(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTodos = [
        {
          id: 1,
          title: '处理订单 #20231129001',
          type: 'order',
          priority: 'high',
          status: 'pending',
          deadline: '2025-11-29 18:00:00',
          description: '客户要求尽快确认订单'
        },
        {
          id: 2,
          title: '车辆维护检查 - 京A12345',
          type: 'vehicle',
          priority: 'medium',
          status: 'pending',
          deadline: '2025-11-29 20:00:00',
          description: '定期维护检查'
        },
        {
          id: 3,
          title: '回复客户咨询',
          type: 'message',
          priority: 'low',
          status: 'pending',
          deadline: '2025-11-30 12:00:00',
          description: '客户咨询租车流程'
        },
        {
          id: 4,
          title: '审核退款申请',
          type: 'refund',
          priority: 'high',
          status: 'pending',
          deadline: '2025-11-29 17:00:00',
          description: '订单 #20231128005 退款申请'
        },
        {
          id: 5,
          title: '更新车辆照片',
          type: 'vehicle',
          priority: 'low',
          status: 'completed',
          deadline: '2025-11-28 18:00:00',
          description: '更新车辆展示照片'
        }
      ]

      // 根据状态筛选
      let filteredTodos = mockTodos
      if (params && params.status) {
        filteredTodos = mockTodos.filter(todo => todo.status === params.status)
      }

      resolve({
        list: filteredTodos,
        total: filteredTodos.length
      })
    }, 500)
  })
}

/**
 * 更新任务状态
 */
export function updateTodoStatus(id, status) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        status,
        message: '任务状态更新成功'
      })
    }, 300)
  })
}

/**
 * 获取今日提醒
 */
export function getTodayReminders() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        list: [
          {
            id: 1,
            type: 'order',
            title: '今日有5个订单待确认',
            time: '09:00'
          },
          {
            id: 2,
            type: 'vehicle',
            title: '京A12345 需要进行维护检查',
            time: '14:00'
          },
          {
            id: 3,
            type: 'meeting',
            title: '下午3点部门例会',
            time: '15:00'
          }
        ]
      })
    }, 300)
  })
}

export default {
  getOverview,
  getTodoList,
  updateTodoStatus,
  getTodayReminders
}
