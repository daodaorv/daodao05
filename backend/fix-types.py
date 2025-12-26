#!/usr/bin/env python3
"""
批量修复 TypeScript 文件中的 any 类型问题
"""
import os
import re
from pathlib import Path

def fix_any_types(file_path):
    """修复文件中的 any 类型"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. 修复函数参数中的 any
    content = re.sub(r'\(([^)]*): any\)', r'(\1: unknown)', content)

    # 2. 修复数组类型 any[]
    content = re.sub(r': any\[\]', r': unknown[]', content)

    # 3. 修复变量声明中的 any
    content = re.sub(r': any;', r': unknown;', content)

    # 4. 修复 const/let 声明中的 any
    content = re.sub(r': any =', r': unknown =', content)

    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    """主函数"""
    base_dir = Path('src')
    fixed_count = 0

    # 遍历所有 .ts 文件
    for ts_file in base_dir.rglob('*.ts'):
        if fix_any_types(ts_file):
            print(f'Fixed: {ts_file}')
            fixed_count += 1

    print(f'\nTotal fixed: {fixed_count} files')

if __name__ == '__main__':
    main()
