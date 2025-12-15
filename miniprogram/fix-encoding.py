#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复小程序端所有文件的编码问题
将所有文件转换为 UTF-8 无 BOM 编码
"""

import os
import sys
import chardet
from pathlib import Path

# 设置标准输出编码为 UTF-8
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# 定义要检查的文件模式
FILE_PATTERNS = [
    'pages/**/*.vue',
    'components/**/*.vue',
    'api/**/*.ts',
    'stores/**/*.ts',
    'utils/**/*.ts',
    'mock/**/*.ts',
    'types/**/*.ts',
    'App.vue'
]

# 统计信息
stats = {
    'total': 0,
    'fixed': 0,
    'already_utf8': 0,
    'errors': 0
}

fixed_files = []
error_files = []

def detect_encoding(file_path):
    """检测文件编码"""
    try:
        with open(file_path, 'rb') as f:
            raw_data = f.read()
            result = chardet.detect(raw_data)
            return result['encoding'], result['confidence']
    except Exception as e:
        print(f"  ✗ 检测编码失败: {e}")
        return None, 0

def remove_bom(content):
    """移除 BOM"""
    if content.startswith('\ufeff'):
        return content[1:]
    return content

def fix_file_encoding(file_path):
    """修复文件编码"""
    try:
        # 读取原始字节
        with open(file_path, 'rb') as f:
            raw_data = f.read()

        # 检查是否为空文件
        if len(raw_data) == 0:
            print(f"  ⊘ 空文件，跳过")
            return 'skip'

        # 检测编码
        detected_encoding, confidence = detect_encoding(file_path)

        if not detected_encoding:
            print(f"  ✗ 无法检测编码")
            return 'error'

        print(f"  检测到编码: {detected_encoding} (置信度: {confidence:.2f})")

        # 尝试用检测到的编码读取
        try:
            content = raw_data.decode(detected_encoding)
        except Exception as e:
            # 如果检测的编码失败，尝试常见编码
            encodings_to_try = ['utf-8', 'gbk', 'gb2312', 'gb18030', 'latin-1']
            content = None

            for enc in encodings_to_try:
                try:
                    content = raw_data.decode(enc)
                    print(f"  使用 {enc} 编码成功")
                    break
                except:
                    continue

            if content is None:
                print(f"  ✗ 所有编码尝试失败")
                return 'error'

        # 移除 BOM
        content = remove_bom(content)

        # 检查是否已经是 UTF-8 无 BOM
        try:
            # 尝试用 UTF-8 重新编码
            utf8_bytes = content.encode('utf-8')

            # 检查是否有 BOM
            has_bom = raw_data[:3] == b'\xef\xbb\xbf'

            # 如果原文件就是 UTF-8 无 BOM，且内容一致，则跳过
            if not has_bom and raw_data == utf8_bytes:
                print(f"  ✓ 已是 UTF-8 无 BOM")
                return 'already_utf8'

            # 写入 UTF-8 无 BOM
            with open(file_path, 'wb') as f:
                f.write(utf8_bytes)

            if has_bom:
                print(f"  ✓ 已修复 (移除 BOM)")
            else:
                print(f"  ✓ 已修复 (转换为 UTF-8)")

            return 'fixed'

        except Exception as e:
            print(f"  ✗ 转换失败: {e}")
            return 'error'

    except Exception as e:
        print(f"  ✗ 处理失败: {e}")
        return 'error'

def scan_and_fix():
    """扫描并修复所有文件"""
    print("=" * 60)
    print("开始扫描和修复编码问题...")
    print("=" * 60)
    print()

    base_path = Path('.')

    # 收集所有需要处理的文件
    files_to_process = []

    for pattern in FILE_PATTERNS:
        if '**' in pattern:
            # 递归搜索
            parts = pattern.split('/')
            if len(parts) > 1:
                dir_part = parts[0]
                file_part = '/'.join(parts[1:])
                if dir_part == '**':
                    files_to_process.extend(base_path.rglob(file_part))
                else:
                    files_to_process.extend((base_path / dir_part).rglob(file_part.replace('**/', '')))
        else:
            # 单个文件
            file_path = base_path / pattern
            if file_path.exists():
                files_to_process.append(file_path)

    # 去重
    files_to_process = list(set(files_to_process))

    print(f"找到 {len(files_to_process)} 个文件需要检查\n")

    # 处理每个文件
    for file_path in sorted(files_to_process):
        stats['total'] += 1
        print(f"[{stats['total']}/{len(files_to_process)}] 检查: {file_path}")

        result = fix_file_encoding(file_path)

        if result == 'fixed':
            stats['fixed'] += 1
            fixed_files.append(str(file_path))
        elif result == 'already_utf8':
            stats['already_utf8'] += 1
        elif result == 'error':
            stats['errors'] += 1
            error_files.append(str(file_path))

        print()

    # 打印统计信息
    print("=" * 60)
    print("修复完成统计")
    print("=" * 60)
    print(f"总文件数: {stats['total']}")
    print(f"已修复: {stats['fixed']}")
    print(f"已是 UTF-8: {stats['already_utf8']}")
    print(f"失败: {stats['errors']}")
    print()

    if fixed_files:
        print("已修复的文件:")
        for f in fixed_files:
            print(f"  ✓ {f}")
        print()

    if error_files:
        print("修复失败的文件:")
        for f in error_files:
            print(f"  ✗ {f}")
        print()

    print("完成!")

    return stats['errors'] == 0

if __name__ == '__main__':
    try:
        success = scan_and_fix()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n用户中断")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n发生错误: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
