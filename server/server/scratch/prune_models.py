path = 'App/models.py'
import sys

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

to_remove = [
    'Subscription', 'ConsultationSession', 'MarketplacePlan', 'Admin', 
    'Permission', 'StatusLog'
]

new_lines = []
skip_until_class = False

i = 0
while i < len(lines):
    line = lines[i]
    
    # 1. Start skipping if class is in to_remove
    if line.strip().startswith('class ') and any(cls in line for cls in to_remove):
        skip_until_class = True
        i += 1
        continue
    
    if skip_until_class:
        if line.strip().startswith('class '):
             skip_until_class = False
             # Fall through to process this new class
        else:
             i += 1
             continue

    # 2. Prune relationships in remaining classes
    prune_keywords = [
        'Subscription', 'ConsultationSession', 'MarketplacePlan', 'Admin', 
        'Permission', 'StatusLog', 'sent_messages', 'received_messages',
        'assigned_nutritionist', 'clients', 'permissions'
    ]
    
    if any(key in line for key in prune_keywords):
        # Specific check to not delete 'Nutritionist' or 'Patient' class itself or their legitimate fields
        is_safe = False
        if line.strip().startswith('class Patient'): is_safe = True
        if line.strip().startswith('class Nutritionist'): is_safe = True
        
        # Relationships to prune
        if 'relationship' in line and any(key in line for key in prune_keywords if key not in ['Patient', 'Nutritionist']):
            i += 1
            continue
        
        # Foreign keys to prune
        if 'ForeignKey' in line and any(key in line for key in ['admins', 'permissions', 'subscriptions', 'sessions', 'marketplace_plans', 'status_logs']):
            i += 1
            continue

    new_lines.append(line)
    i += 1

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Models pruned successfully")
