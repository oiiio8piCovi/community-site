#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
递归格式化当前目录下所有 .js .css .html 文件。
库依赖：
  - jsbeautifier 处理 .js
  - cssutils 处理 .css
  - BeautifulSoup 处理 .html
支持通过命令行 -i、--ignore 参数或 format_ignore.txt 忽略特定文件。
实例：
  python format_web_files.py -i .\site\index.html
"""

import os
import sys
import subprocess
import logging
import argparse
import fnmatch
from pathlib import PurePath

# 依赖检查与自动安装
REQUIRED = {
    "jsbeautifier": "jsbeautifier",
    "cssutils": "cssutils",
    "bs4": "beautifulsoup4",
    "lxml": "lxml"
}

missing = []
for mod, pkg in REQUIRED.items():
    try:
        __import__(mod)
    except ImportError:
        missing.append(pkg)

if missing:
    print(f"缺失依赖库: {', '.join(missing)}")
    print("开始自动安装，请稍候...\n")
    for pkg in missing:
        print(f"↓ 正在安装 {pkg} ...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "--user", pkg])
        print(f"✅ {pkg} 安装完成\n")
    print("\n所有依赖安装完成！\n")

# 导入依赖
import jsbeautifier
import cssutils
from bs4 import BeautifulSoup

# 减少 cssutils 的冗余日志（只显示严重错误）
cssutils.log.setLevel(logging.CRITICAL)

# 格式化配置
INDENT = 4  # 缩进空格数

# jsbeautifier 配置（仅用于 JS）
JS_OPTS = {
    "indent_size": INDENT,
    "indent_char": " ",
    "preserve_newlines": True,
    "max_preserve_newlines": 2,
    "wrap_line_length": 0,
    "eol": "\n",
}

# cssutils 配置
cssutils.ser.prettify = True
cssutils.ser.indent = ' ' * INDENT
cssutils.ser.style = {
    'separator': ' ',
    'space_after_selector': ' ',
}


def format_js(content):
    return jsbeautifier.beautify(content, JS_OPTS)


def format_css(content):
    try:
        sheet = cssutils.parseString(content)
        return sheet.cssText.decode('utf-8')
    except Exception as e:
        print(f"    ⚠️ CSS解析警告（保留原始内容）: {e}")
        return content


def format_html(content):
    """格式化 HTML，兼容新旧 BeautifulSoup 版本"""
    try:
        soup = BeautifulSoup(content, 'lxml')
    except Exception as e:
        print(f"    ⚠️ lxml 解析器不可用，使用内置 html.parser（原因: {e}）")
        soup = BeautifulSoup(content, 'html.parser')

    try:
        html = soup.prettify(indent=INDENT)
    except TypeError:
        html = soup.prettify()
        lines = html.splitlines()
        new_lines = []
        for line in lines:
            if not line.strip():
                new_lines.append('')
                continue
            stripped = line.lstrip(' ')
            leading = len(line) - len(stripped)
            level = leading // 2
            new_indent = ' ' * (level * INDENT)
            new_lines.append(new_indent + stripped)
        html = '\n'.join(new_lines)
    return html


def load_ignore_patterns(debug=False):
    """从 format_ignore.txt 和命令行参数加载忽略模式"""
    patterns = []

    # 读取 format_ignore.txt
    ignore_file = 'format_ignore.txt'
    if os.path.isfile(ignore_file):
        with open(ignore_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    pattern = os.path.normpath(line).replace('\\', '/')
                    patterns.append(pattern)
                    if debug:
                        print(f"[DEBUG] 从文件加载忽略模式: {pattern}")

    # 命令行参数
    parser = argparse.ArgumentParser(description='格式化 web 文件')
    parser.add_argument('-i', '--ignore', nargs='*', help='要忽略的文件或目录模式（支持通配符）')
    parser.add_argument('--debug', action='store_true', help='显示调试信息')
    args = parser.parse_args()

    if args.ignore:
        for p in args.ignore:
            pattern = os.path.normpath(p).replace('\\', '/')
            patterns.append(pattern)
            if debug or args.debug:
                print(f"[DEBUG] 从命令行加载忽略模式: {pattern}")

    return patterns, args.debug


def is_ignored(filepath, patterns, debug=False):
    if not patterns:
        return False
    relpath = os.path.relpath(filepath, start=os.getcwd()).replace('\\', '/')
    if debug:
        print(f"[DEBUG] 检查路径: {relpath} 是否匹配 {patterns}")

    for pat in patterns:
        if '**' in pat:
            # 使用 PurePath.match 支持递归匹配
            if PurePath(relpath).match(pat):
                if debug:
                    print(f"[DEBUG] 匹配成功 (递归): {relpath} -> {pat}")
                return True
        else:
            if fnmatch.fnmatch(relpath, pat):
                if debug:
                    print(f"[DEBUG] 匹配成功 (fnmatch): {relpath} -> {pat}")
                return True
    return False


def format_file(filepath, ignore_patterns, debug=False):
    if is_ignored(filepath, ignore_patterns, debug):
        if debug:
            print(f"忽略文件: {filepath}")
        return False  # 表示跳过

    _, ext = os.path.splitext(filepath)
    ext = ext.lower()

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"⚠️  读取失败 {filepath}: {e}")
        return False

    try:
        if ext == '.js':
            formatted = format_js(content)
        elif ext == '.css':
            formatted = format_css(content)
        elif ext == '.html':
            formatted = format_html(content)
        else:
            return False

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(formatted)
        print(f"✅ 已格式化: {filepath}")
        return True
    except Exception as e:
        print(f"❌ 格式化失败 {filepath}: {e}")
        return False


def main():
    ignore_patterns, debug = load_ignore_patterns()
    if ignore_patterns and debug:
        print(f"最终忽略模式: {ignore_patterns}")

    count = 0
    for root, _, files in os.walk('.'):
        for name in files:
            if name.endswith(('.js', '.css', '.html')):
                filepath = os.path.join(root, name)
                if format_file(filepath, ignore_patterns, debug):
                    count += 1

    print(f"\n处理完成，共格式化 {count} 个文件。")


if __name__ == '__main__':
    main()