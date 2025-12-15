/**
 * 数据统计相关Mock数据
 */

/**
 * 获取个人统计数据
 */
export function getPersonalStatistics(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { period = 'today' } = params || {}

      // 根据时间周期返回不同数据
      const dataMap = {
        today: {
          ordersProcessed: 12,
          ordersCompleted: 10,
          ordersPending: 2,
          vehiclesInspected: 8,
          customersServed: 15,
          workHours: 7.5,
          efficiency: 92,
          satisfaction: 4.8
        },
        week: {
          ordersProcessed: 68,
          ordersCompleted: 62,
          ordersPending: 6,
          vehiclesInspected: 45,
          customersServed: 82,
          workHours: 42,
          efficiency: 89,
          satisfaction: 4.7
        },
        month: {
          ordersProcessed: 285,
          ordersCompleted: 268,
          ordersPending: 17,
          vehiclesInspected: 198,
          customersServed: 356,
          workHours: 176,
          efficiency: 91,
          satisfaction: 4.8
        }
      }

      resolve({
        code: 200,
        data: {
          period,
          statistics: dataMap[period] || dataMap.today,
          // 趋势数据（用于图表）
          trends: {
            orders: [8, 10, 12, 9, 11, 13, 12],
            efficiency: [88, 90, 89, 92, 91, 93, 92],
            satisfaction: [4.6, 4.7, 4.8, 4.7, 4.8, 4.9, 4.8]
          },
          // 订单类型分布
          orderTypes: [
            { type: '取车', count: 145, percentage: 51 },
            { type: '还车', count: 120, percentage: 42 },
            { type: '维保', count: 20, percentage: 7 }
          ],
          // 工作时段分布
          workTimeDistribution: [
            { hour: '08:00', count: 2 },
            { hour: '09:00', count: 5 },
            { hour: '10:00', count: 8 },
            { hour: '11:00', count: 6 },
            { hour: '12:00', count: 3 },
            { hour: '13:00', count: 2 },
            { hour: '14:00', count: 7 },
            { hour: '15:00', count: 9 },
            { hour: '16:00', count: 8 },
            { hour: '17:00', count: 5 }
          ]
        }
      })
    }, 500)
  })
}

/**
 * 获取团队统计数据
 */
export function getTeamStatistics(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { period = 'today' } = params || {}

      resolve({
        code: 200,
        data: {
          period,
          // 团队总览
          overview: {
            totalMembers: 8,
            activeMembers: 7,
            totalOrders: 96,
            completedOrders: 88,
            averageEfficiency: 90,
            averageSatisfaction: 4.7
          },
          // 成员排名
          memberRanking: [
            {
              id: 1,
              name: '张经理',
              avatar: '',
              ordersProcessed: 12,
              efficiency: 92,
              satisfaction: 4.8,
              rank: 1
            },
            {
              id: 2,
              name: '李员工',
              avatar: '',
              ordersProcessed: 11,
              efficiency: 90,
              satisfaction: 4.7,
              rank: 2
            },
            {
              id: 3,
              name: '王师傅',
              avatar: '',
              ordersProcessed: 10,
              efficiency: 89,
              satisfaction: 4.6,
              rank: 3
            },
            {
              id: 4,
              name: '赵助理',
              avatar: '',
              ordersProcessed: 9,
              efficiency: 88,
              satisfaction: 4.5,
              rank: 4
            },
            {
              id: 5,
              name: '刘专员',
              avatar: '',
              ordersProcessed: 8,
              efficiency: 87,
              satisfaction: 4.4,
              rank: 5
            }
          ],
          // 团队趋势
          trends: {
            orders: [72, 78, 85, 82, 88, 92, 96],
            efficiency: [86, 87, 88, 89, 89, 90, 90],
            satisfaction: [4.5, 4.5, 4.6, 4.6, 4.7, 4.7, 4.7]
          },
          // 部门分布
          departmentDistribution: [
            { department: '取还车部', members: 3, orders: 45, percentage: 47 },
            { department: '维保部', members: 2, orders: 28, percentage: 29 },
            { department: '客服部', members: 2, orders: 18, percentage: 19 },
            { department: '管理部', members: 1, orders: 5, percentage: 5 }
          ]
        }
      })
    }, 500)
  })
}

/**
 * 获取车辆统计数据
 */
export function getVehicleStatistics(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { period = 'today' } = params || {}

      resolve({
        code: 200,
        data: {
          period,
          // 车辆总览
          overview: {
            totalVehicles: 50,
            availableVehicles: 18,
            rentedVehicles: 28,
            maintenanceVehicles: 4,
            utilizationRate: 0.76,
            averageMileage: 12500
          },
          // 车辆状态分布
          statusDistribution: [
            { status: '可用', count: 18, percentage: 36, color: '#19be6b' },
            { status: '租用中', count: 28, percentage: 56, color: '#2979ff' },
            { status: '维保中', count: 4, percentage: 8, color: '#ff9900' }
          ],
          // 车型分布
          modelDistribution: [
            { model: 'A型房车', count: 15, percentage: 30 },
            { model: 'B型房车', count: 20, percentage: 40 },
            { model: 'C型房车', count: 12, percentage: 24 },
            { model: '拖挂式', count: 3, percentage: 6 }
          ],
          // 使用率趋势
          utilizationTrend: [
            { date: '12-01', rate: 72 },
            { date: '12-02', rate: 74 },
            { date: '12-03', rate: 76 },
            { date: '12-04', rate: 75 },
            { date: '12-05', rate: 76 },
            { date: '12-06', rate: 78 },
            { date: '12-07', rate: 76 }
          ],
          // 维保统计
          maintenanceStats: {
            totalMaintenance: 12,
            scheduledMaintenance: 8,
            emergencyRepair: 4,
            averageCost: 1850,
            totalCost: 22200
          },
          // 热门车辆 Top 5
          topVehicles: [
            {
              id: 1,
              vehicleNo: 'RV001',
              model: 'B型房车',
              brand: '大通 RG10',
              orders: 28,
              revenue: 45600,
              utilizationRate: 0.93
            },
            {
              id: 2,
              vehicleNo: 'RV002',
              model: 'A型房车',
              brand: '依维柯 C型',
              orders: 25,
              revenue: 42500,
              utilizationRate: 0.89
            },
            {
              id: 3,
              vehicleNo: 'RV003',
              model: 'C型房车',
              brand: '福特 全顺',
              orders: 23,
              revenue: 38900,
              utilizationRate: 0.85
            },
            {
              id: 4,
              vehicleNo: 'RV004',
              model: 'B型房车',
              brand: '大通 V90',
              orders: 22,
              revenue: 36800,
              utilizationRate: 0.82
            },
            {
              id: 5,
              vehicleNo: 'RV005',
              model: 'A型房车',
              brand: '依维柯 欧胜',
              orders: 20,
              revenue: 34000,
              utilizationRate: 0.78
            }
          ],
          // 故障统计
          faultStats: {
            totalFaults: 8,
            minorFaults: 5,
            majorFaults: 3,
            faultTypes: [
              { type: '电路故障', count: 3 },
              { type: '发动机故障', count: 2 },
              { type: '空调故障', count: 2 },
              { type: '其他', count: 1 }
            ]
          }
        }
      })
    }, 500)
  })
}

/**
 * 获取收益统计数据
 */
export function getRevenueStatistics(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { period = 'month' } = params || {}

      resolve({
        code: 200,
        data: {
          period,
          // 收益总览
          overview: {
            totalRevenue: 285600,
            rentalRevenue: 245000,
            serviceRevenue: 28600,
            otherRevenue: 12000,
            growth: 15.8
          },
          // 收益趋势
          revenueTrend: [
            { date: '12-01', revenue: 38500 },
            { date: '12-02', revenue: 42000 },
            { date: '12-03', revenue: 45600 },
            { date: '12-04', revenue: 41200 },
            { date: '12-05', revenue: 43800 },
            { date: '12-06', revenue: 46500 },
            { date: '12-07', revenue: 28000 }
          ],
          // 收益来源分布
          revenueSource: [
            { source: '租车收入', amount: 245000, percentage: 86 },
            { source: '服务费', amount: 28600, percentage: 10 },
            { source: '其他收入', amount: 12000, percentage: 4 }
          ],
          // 月度对比
          monthlyComparison: [
            { month: '7月', revenue: 235000 },
            { month: '8月', revenue: 248000 },
            { month: '9月', revenue: 256000 },
            { month: '10月', revenue: 268000 },
            { month: '11月', revenue: 275000 },
            { month: '12月', revenue: 285600 }
          ]
        }
      })
    }, 500)
  })
}

export default {
  getPersonalStatistics,
  getTeamStatistics,
  getVehicleStatistics,
  getRevenueStatistics
}
