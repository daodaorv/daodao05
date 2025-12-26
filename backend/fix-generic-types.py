#!/usr/bin/env python3
"""
全面修复 DAO 层的泛型类型问题
"""
import re
from pathlib import Path

def fix_generic_types(file_path):
    """修复泛型类型"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 修复泛型中的 unknown
    content = re.sub(r'<unknown>', '<any>', content)
    content = re.sub(r'<unknown,', '<any,', content)
    content = re.sub(r', unknown>', ', any>', content)

    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    dao_dir = Path('src/dao')
    fixed = 0

    for dao_file in sorted(dao_dir.glob('*.dao.ts')):
        if fix_generic_types(dao_file):
            print(f'Fixed: {dao_file.name}')
            fixed += 1

    print(f'\nTotal: {fixed} files')

if __name__ == '__main__':
    main()
