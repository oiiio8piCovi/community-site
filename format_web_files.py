#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
使用 Prettier 格式化 .js .css .html 文件。
支持忽略文件（通过 -i 参数或 format_ignore.txt）。
一次性传入所有文件，大幅提升速度。
"""

import os
import sys
import subprocess
import platform
import shutil
import argparse
import fnmatch
from pathlib import PurePath

FILE_EXTENSIONS = ['.js', '.css', '.html']

def find_executable(name):
    """在 PATH 和常见 Node.js 安装路径中查找可执行文件"""
    path = shutil.which(name)
    if path:
        return path
    if platform.system() == 'Windows':
        appdata = os.environ.get('APPDATA', '')
        if appdata:
            npm_path = os.path.join(appdata, 'npm', f'{name}.cmd')
            if os.path.exists(npm_path):
                return npm_path
        program_files = os.environ.get('ProgramFiles', 'C:\\Program Files')
        node_path = os.path.join(program_files, 'nodejs', f'{name}.cmd')
        if os.path.exists(node_path):
            return node_path
        local_appdata = os.environ.get('LOCALAPPDATA', '')
        if local_appdata:
            node_path = os.path.join(local_appdata, 'Programs', 'nodejs', f'{name}.cmd')
            if os.path.exists(node_path):
                return node_path
    return None

def run_command(cmd):
    """执行命令，不检查返回值，打印输出"""
    print(f"执行: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if result.returncode != 0:
        print("⚠️ 命令执行出错（部分文件可能有语法问题）")
        if result.stderr:
            print(result.stderr)
        if result.stdout:
            print(result.stdout)
    else:
        if result.stdout:
            print(result.stdout)
    return result

def check_npx():
    npx_path = find_executable('npx')
    if npx_path:
        print(f"✅ 找到 npx: {npx_path}")
    else:
        print("❌ 未找到 npx。")
        print("PATH 环境变量:")
        for p in os.environ.get('PATH', '').split(os.pathsep):
            print(f"  {p}")
    return npx_path

def install_instructions():
    system = platform.system()
    print("\n请先安装 Node.js（它自带 npx）：")
    if system == 'Windows':
        print("  方法一（推荐）：使用 winget")
        print("    winget install nodejs")
        print("  方法二：从官网下载安装包")
        print("    https://nodejs.org/")
        print("  安装完成后，请**重新打开终端**，然后再次运行此脚本。")
        print("  如果仍然找不到，请手动将 Node.js 安装目录（例如 C:\\Program Files\\nodejs）添加到系统 PATH。")
    elif system == 'Darwin':
        print("  使用 Homebrew：")
        print("    brew install node")
    else:
        print("  使用系统包管理器（例如 Ubuntu/Debian）：")
        print("    sudo apt update && sudo apt install nodejs npm")
        print("  或从官网下载：https://nodejs.org/")
    sys.exit(1)

def load_ignore_patterns():
    patterns = []
    ignore_file = 'format_ignore.txt'
    if os.path.isfile(ignore_file):
        with open(ignore_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    pattern = os.path.normpath(line).replace('\\', '/')
                    patterns.append(pattern)
                    print(f"[忽略配置] 从文件加载: {pattern}")

    parser = argparse.ArgumentParser(description='格式化 web 文件')
    parser.add_argument('-i', '--ignore', nargs='*', help='要忽略的文件或目录模式（支持通配符）')
    args = parser.parse_args()
    if args.ignore:
        for p in args.ignore:
            pattern = os.path.normpath(p).replace('\\', '/')
            patterns.append(pattern)
            print(f"[忽略配置] 从命令行加载: {pattern}")

    return patterns

def is_ignored(filepath, patterns):
    if not patterns:
        return False
    relpath = os.path.relpath(filepath, start=os.getcwd()).replace('\\', '/')
    for pat in patterns:
        if '**' in pat:
            if PurePath(relpath).match(pat):
                return True
        else:
            if fnmatch.fnmatch(relpath, pat):
                return True
    return False

def collect_files(directory='.'):
    files = []
    for root, _, filenames in os.walk(directory):
        for name in filenames:
            if any(name.endswith(ext) for ext in FILE_EXTENSIONS):
                files.append(os.path.join(root, name))
    return files

def main():
    npx_path = check_npx()
    if not npx_path:
        install_instructions()

    ignore_patterns = load_ignore_patterns()
    all_files = collect_files()
    print(f"找到 {len(all_files)} 个文件。")

    to_format = [f for f in all_files if not is_ignored(f, ignore_patterns)]
    skipped = len(all_files) - len(to_format)
    if skipped:
        print(f"⏭️ 已忽略 {skipped} 个文件（根据忽略规则）。")

    if not to_format:
        print("没有需要格式化的文件。")
        return

    print(f"正在格式化 {len(to_format)} 个文件...")
    cmd = [npx_path, 'prettier', '--write'] + to_format
    run_command(cmd)

    print("\n所有文件处理完毕。")

if __name__ == '__main__':
    main()