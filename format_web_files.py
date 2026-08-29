#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import subprocess
import platform
import shutil
import fnmatch
import argparse
from pathlib import PurePath

# 配置
FILE_EXTENSIONS = ['.js', '.css', '.html']
IGNORE_FILE = 'format_ignore.txt'
INDENT = 4  # 仅供保留，实际Prettier会用自己的配置

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

def run_command(cmd, capture_output=False, check=True):
    """执行命令，可选捕获输出"""
    print(f"执行: {' '.join(cmd)}")
    if capture_output:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if check and result.returncode != 0:
            print(f"命令失败: {result.stderr}")
            sys.exit(1)
        return result.stdout.strip()
    else:
        subprocess.run(cmd, check=check)

def load_ignore_patterns(debug=False):
    """从 format_ignore.txt 和命令行参数加载忽略模式"""
    patterns = []

    # 读取 format_ignore.txt
    if os.path.isfile(IGNORE_FILE):
        with open(IGNORE_FILE, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    pattern = os.path.normpath(line).replace('\\', '/')
                    patterns.append(pattern)
                    if debug:
                        print(f"[DEBUG] 从文件加载忽略模式: {pattern}")

    # 命令行参数
    parser = argparse.ArgumentParser(description='格式化 web 文件（使用 Prettier）')
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
    """判断文件是否被忽略"""
    if not patterns:
        return False
    relpath = os.path.relpath(filepath, start=os.getcwd()).replace('\\', '/')
    if debug:
        print(f"[DEBUG] 检查路径: {relpath}")
    for pat in patterns:
        if fnmatch.fnmatch(relpath, pat):
            if debug:
                print(f"[DEBUG] 匹配忽略模式: {pat}")
            return True
        # 也支持 ** 递归匹配（fnmatch 不支持 **，但可转换为多级）
        # 若模式包含 **，则使用 PurePath.match
        if '**' in pat:
            if PurePath(relpath).match(pat):
                if debug:
                    print(f"[DEBUG] 匹配忽略模式 (递归): {pat}")
                return True
    return False

def collect_files(directory, extensions, ignore_patterns, debug=False):
    """收集需要格式化的文件列表"""
    files = []
    for root, _, filenames in os.walk(directory):
        for name in filenames:
            if any(name.endswith(ext) for ext in extensions):
                filepath = os.path.join(root, name)
                if not is_ignored(filepath, ignore_patterns, debug):
                    files.append(filepath)
                else:
                    if debug:
                        print(f"[DEBUG] 忽略文件: {filepath}")
    return files

def check_npx():
    """检查 npx 是否可用，返回路径或 None"""
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
    """根据平台打印安装指引"""
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

def format_files(file_list, npx_path):
    """使用 Prettier 格式化文件列表"""
    if not file_list:
        print("没有需要格式化的文件。")
        return

    # 将文件列表分批，避免命令行过长（Windows 有限制）
    batch_size = 50
    for i in range(0, len(file_list), batch_size):
        batch = file_list[i:i+batch_size]
        cmd = [npx_path, 'prettier', '--write'] + batch
        run_command(cmd)

def main():
    # 加载忽略模式
    ignore_patterns, debug = load_ignore_patterns()

    # 检查 npx
    npx_path = check_npx()
    if not npx_path:
        install_instructions()

    # 收集文件
    files = collect_files('.', FILE_EXTENSIONS, ignore_patterns, debug)
    print(f"找到 {len(files)} 个文件需要格式化。")

    # 格式化
    format_files(files, npx_path)

if __name__ == '__main__':
    main()