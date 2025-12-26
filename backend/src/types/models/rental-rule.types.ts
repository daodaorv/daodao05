/**
 * 租车须知相关类型定义
 */

import { RowDataPacket } from 'mysql2/promise';

export type RentalRuleProductType = 'vehicle' | 'special-offer';

export interface RentalRuleRichItem {
  title: string;
  description: string;
}

export interface RentalRuleSection {
  id: string;
  title: string;
  summary?: string;
  highlight?: string;
  items?: RentalRuleRichItem[];
  paragraphs?: string[];
}

export interface RentalRuleContent {
  productType: RentalRuleProductType;
  version: string;
  sections: RentalRuleSection[];
}

export interface RentalRule extends RowDataPacket {
  id: number;
  product_type: RentalRuleProductType;
  version: string;
  content: RentalRuleContent;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}
