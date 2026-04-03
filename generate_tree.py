import os

def print_tree(startpath, exclude_dirs):
    tree_str = ""
    for root, dirs, files in os.walk(startpath):
        # Exclude specified directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        # Calculate level for indentation
        level = root.replace(startpath, '').count(os.sep)
        indent = '    ' * level
        
        # Add root folder name
        if root == startpath:
            tree_str += f"{os.path.basename(root)}/\n"
        else:
            tree_str += f"{indent}├── {os.path.basename(root)}/\n"
            
        # Add files
        subindent = '    ' * (level + 1)
        for f in files:
            tree_str += f"{subindent}├── {f}\n"
            
    return tree_str

if __name__ == '__main__':
    project_dir = r"c:\Users\HP\Desktop\AI Calorie Estimation System Project\Frontend Project"
    exclusions = {'node_modules', '.git', 'dist', '__pycache__', 'venv', '.next', 'build'}
    tree = print_tree(project_dir, exclusions)
    
    out_path = os.path.join(project_dir, "project_structure.txt")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(tree)
    print("Structure written to:", out_path)
