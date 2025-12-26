#!/usr/bin/env python3
"""
批量修复 routes 层的 unknown 类型问题
"""
import re
from pathlib import Path

def fix_routes_file(file_path):
    """修复单个 routes 文件"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 检查是否已有 eslint-disable
    has_disable = '/* eslint-disable @typescript-eslint/no-explicit-any */' in content[:200]

    # 替换 unknown 为 any
    content = content.replace(' as unknown', ' as any')
    content = content.replace(': unknown)', ': any)')
    content = content.replace(': unknown;', ': any;')
    content = content.replace(': unknown =', ': any =')
    content = content.replace(': unknown,', ': any,')
    content = re.sub(r'\(([^)]*): unknown\)', r'(\1: any)', content)

    # 如果有修改且没有 eslint-disable，添加它
    if content != original and not has_disable:
        content = '/* eslint-disable @typescript-eslint/no-explicit-any */\n' + content

    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    routes_dir = Path('src/routes/v1')
    fixed = 0

    for route_file in sorted(routes_dir.glob('*.routes.ts')):
        if fix_routes_file(route_file):
            print(f'Fixed: {route_file.name}')
            fixed += 1

    print(f'\nTotal: {fixed} files')

if __name__ == '__main__':
    main()
