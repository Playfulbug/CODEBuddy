#!/usr/bin/env python3
import os
import zipfile

def build_zip():
    cwd = os.getcwd()
    output_path = os.path.join(cwd, "public", "codemastery-updated.zip")
    os.makedirs(os.path.join(cwd, "public"), exist_ok=True)
    
    exclude_dirs = {
        "node_modules",
        ".git",
        "dist",
        ".aistudio",
        "__pycache__",
        ".manus-logs"
    }
    
    exclude_files = {
        "codemastery-updated.zip",
        ".DS_Store"
    }
    
    total_files = 0
    with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(cwd):
            # filter out ignored dirs in-place
            dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith(".git")]
            
            for f in files:
                if f in exclude_files:
                    continue
                full_path = os.path.join(root, f)
                rel_path = os.path.relpath(full_path, cwd)
                
                # skip public/assets/aistudio/*.zip or the output zip
                if rel_path == "public/codemastery-updated.zip":
                    continue
                if rel_path.startswith("public/assets/aistudio/"):
                    continue
                    
                z.write(full_path, arcname=rel_path)
                total_files += 1

    file_size_kb = os.path.getsize(output_path) / 1024
    print(f"Created {output_path}: {total_files} files, {file_size_kb:.1f} KB")

if __name__ == "__main__":
    build_zip()
