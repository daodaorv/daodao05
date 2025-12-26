-- 创建旅游批次表
CREATE TABLE IF NOT EXISTS tour_batches (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tour_id INT NOT NULL COMMENT '旅游线路ID',
  departure_date DATE NOT NULL COMMENT '出发日期',
  return_date DATE NOT NULL COMMENT '返回日期',
  status ENUM('recruiting', 'confirmed', 'departed', 'completed', 'cancelled') DEFAULT 'recruiting' COMMENT '状态',
  current_people INT DEFAULT 0 COMMENT '当前人数',
  max_people INT NOT NULL COMMENT '最大人数',
  guide_name VARCHAR(50) COMMENT '领队姓名',
  guide_phone VARCHAR(20) COMMENT '领队电话',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tour_id (tour_id),
  INDEX idx_departure_date (departure_date),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='旅游批次表';
