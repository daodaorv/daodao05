-- 租车须知测试数据
USE daodao;

-- 插入房车租赁的租车须知
INSERT INTO rental_rules (product_type, version, content, status) VALUES (
  'vehicle',
  '2024-12-06',
  JSON_OBJECT(
    'productType', 'vehicle',
    'version', '2024-12-06',
    'sections', JSON_ARRAY(
      JSON_OBJECT(
        'id', 'handover-process',
        'title', '取还车流程手续',
        'summary', '到场需持本人身份证、驾驶证原件，遵循门店审核流程完成取还车。',
        'highlight', '晚还超过30分钟将按照1小时计费，请提前联系我们申请延长。',
        'items', JSON_ARRAY(
          JSON_OBJECT(
            'title', '01 到店核验',
            'description', '提前15分钟到店，出示身份证/驾驶证原件，完成人脸核验并缴纳押金。'
          ),
          JSON_OBJECT(
            'title', '02 车辆查验',
            'description', '与门店共同完成车辆内外观检查，记录油量/公里数，确认附加设备。'
          ),
          JSON_OBJECT(
            'title', '03 还车交付',
            'description', '按预约时间归还，补齐油量并完成二次查验，确认无违章或附加费用后退还押金。'
          )
        )
      ),
      JSON_OBJECT(
        'id', 'booking-terms',
        'title', '预定须知',
        'summary', '请务必阅读完整的租车合同及特殊订单说明，提交订单即视为同意以下条款。',
        'paragraphs', JSON_ARRAY(
          '• 订单一经确认即锁定车辆，行程变更需提前72小时联系客服处理，逾期将按合同违约规则执行；',
          '• 需具备有效期内 C1 及以上准驾车型驾驶证，驾龄不少于2年；',
          '• 如遇道路救援、保险理赔等情况，请第一时间联系叨叨房车客服，不得擅自维修；',
          '• 特殊节假日、长线自驾需签署补充协议，押金及违约规则以协议为准。'
        )
      )
    )
  ),
  'active'
);

-- 插入特惠租车的租车须知
INSERT INTO rental_rules (product_type, version, content, status) VALUES (
  'special-offer',
  '2024-12-06-SO',
  JSON_OBJECT(
    'productType', 'special-offer',
    'version', '2024-12-06-SO',
    'sections', JSON_ARRAY(
      JSON_OBJECT(
        'id', 'handover-process',
        'title', '取还车流程手续（特惠）',
        'summary', '固定门店、固定时段办理，务必按预约时间到店；逾时可能自动取消优惠资格。',
        'highlight', '特惠套餐不支持异地还车及时间调整，如需更改需转为常规定价重新计费。',
        'items', JSON_ARRAY(
          JSON_OBJECT(
            'title', '01 到店排队',
            'description', '凭订单二维码在特惠专属窗口排队，逾时15分钟需重新取号。'
          ),
          JSON_OBJECT(
            'title', '02 快速验车',
            'description', '执行快速查验流程，仅支持基础设备调整，如需额外服务请提前备注。'
          ),
          JSON_OBJECT(
            'title', '03 定点还车',
            'description', '返程需回到原门店指定通道，工作人员根据套餐规则确认油量与里程。'
          )
        )
      ),
      JSON_OBJECT(
        'id', 'booking-terms',
        'title', '预定须知（特惠）',
        'summary', '特惠套餐享受优惠价格，但需遵守更严格的使用规则。',
        'paragraphs', JSON_ARRAY(
          '• 特惠订单不支持退改，预约后请务必按时到店；',
          '• 仅限指定车型和时段，不可更换或升级；',
          '• 超时、超里程将按标准价格补差；',
          '• 特惠套餐不含额外保险和增值服务。'
        )
      )
    )
  ),
  'active'
);
