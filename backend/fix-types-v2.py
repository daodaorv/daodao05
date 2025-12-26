#!/usr/bin/env python3
"""
改进版：批量修复 TypeScript 文件中的 any 类型问题
"""
import os
import re
from pathlib import Path

def fix_any_types_v2(file_path):
    """修复文件中的 any 类型 - 改进版"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. 修复 as any 类型断言
    content = re.sub(r' as any', r' as unknown', content)

    # 2. 修复函数参数中的 any (包括多参数)
    content = re.sub(r'([,\(]\s*\w+\s*:\s*)any(\s*[,\)])', r'\1unknown\2', content)

    # 3. 修复返回类型中的 any
    content = re.sub(r':\s*any\s*=>', r': unknown =>', content)

    # 4. 修复泛型中的 any
    content = re.sub(r'<any>', r'<unknown>', content)
    content = re.sub(r'<any,', r'<unknown,', content)
    content = re.sub(r',\s*any>', r', unknown>', content)

    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    base_dir = Path('src')
    fixed_count = 0

    for ts_file in base_dir.rglob('*.ts'):
        if fix_any_types_v2(ts_file):
            print(f'Fixed: {ts_file}')
            fixed_count += 1

    print(f'\nTotal: {fixed_count} files')

if __name__ == '__main__':
    main()
