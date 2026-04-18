import ast
import os

def find_dups(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        tree = ast.parse(content)
        funcs = [n.name for n in ast.walk(tree) if isinstance(n, ast.FunctionDef)]
        dups = set([f for f in funcs if funcs.count(f) > 1])
        return dups
    except Exception as e:
        return {f"Error: {e}"}

for root, dirs, files in os.walk('App'):
    for file in files:
        if file.endswith('routes.py'):
            path = os.path.join(root, file)
            dups = find_dups(path)
            if dups:
                print(f"{path}: {dups}")
