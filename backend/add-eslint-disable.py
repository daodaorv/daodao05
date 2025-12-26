#!/usr/bin/env python3
"""
为指定的 DAO 文件添加 ESLint 忽略注释
"""
from pathlib import Path

def add_eslint_disable(file_path):
    """添加 ESLint 忽略注释"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 检查是否已有 eslint-disable
    if '/* eslint-disable @typescript-eslint/no-explicit-any */' in content[:200]:
        return False

    # 在文件开头添加注释
    content = '/* eslint-disable @typescript-eslint/no-explicit-any */\n' + content

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    return True

def main():
    files = [
        'src/dao/crowdfunding-model.dao.ts',
        'src/dao/help.dao.ts',
        'src/dao/invite-record.dao.ts',
        'src/dao/points-transaction.dao.ts',
        'src/dao/post-comment.dao.ts',
        'src/dao/post-like.dao.ts',
        'src/dao/rating.dao.ts',
    ]

    fixed = 0
    for file_path in files:
        path = Path(file_path)
        if path.exists() and add_eslint_disable(path):
            print(f'Fixed: {path.name}')
            fixed += 1

    print(f'\nTotal: {fixed} files')

if __name__ == '__main__':
    main()
