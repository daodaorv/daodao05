#!/usr/bin/env python3
"""
修复 routes 文件中的返回值问题
将 return; 改为显式返回 undefined
"""
import re
from pathlib import Path

def fix_return_statements(file_path):
    """修复返回语句"""
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    modified = False
    for i, line in enumerate(lines):
        # 查找模式：res.status(...).json(...); 后面跟着 return;
        if 'res.status' in line and '.json(' in line:
            # 检查下一行是否是 return;
            if i + 1 < len(lines) and lines[i + 1].strip() == 'return;':
                lines[i + 1] = lines[i + 1].replace('return;', 'return undefined;')
                modified = True

    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        return True
    return False

def main():
    routes_dir = Path('src/routes/v1')
    fixed = 0

    for route_file in sorted(routes_dir.glob('*.routes.ts')):
        if fix_return_statements(route_file):
            print(f'Fixed: {route_file.name}')
            fixed += 1

    print(f'\nTotal: {fixed} files')

if __name__ == '__main__':
    main()
