import os
import re

api_dir = 'backend/app/api'
routes = []
for file in os.listdir(api_dir):
    if file.endswith('.py'):
        with open(os.path.join(api_dir, file), 'r', encoding='utf-8') as f:
            for line in f:
                match = re.search(r'@router\.(get|post|put|delete|patch|websocket)\([\'"]([^\'"]+)[\'"]', line)
                if match:
                    method = match.group(1).upper()
                    path = match.group(2)
                    routes.append(f'{file.replace(".py", "")} | {method} | {path}')
for r in sorted(routes):
    print(r)
