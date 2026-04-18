import sys

path = 'App/models.py'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    
    # 1. Disambiguate Nutritionist.clients
    if 'clients: Mapped[List["Patient"]] = relationship("Patient", back_populates="assigned_nutritionist", foreign_keys="[Patient.nutritionist_id]")' in line:
        new_lines.append('    clients: Mapped[List["Patient"]] = relationship(\n')
        new_lines.append('        "Patient",\n')
        new_lines.append('        back_populates="assigned_nutritionist",\n')
        new_lines.append('        foreign_keys="[Patient.nutritionist_id]",\n')
        new_lines.append('        primaryjoin="Patient.nutritionist_id == Nutritionist.id"\n')
        new_lines.append('    )\n')
    
    # 2. Add Subscription and ConsultationSession relationships
    elif 'created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)' in line:
        new_lines.append(line)
        # Check context
        class_name = ""
        for j in range(i, max(0, i-20), -1):
            if lines[j].strip().startswith('class Subscription'):
                class_name = "Subscription"
                break
            if lines[j].strip().startswith('class ConsultationSession'):
                class_name = "ConsultationSession"
                break
        
        if class_name == "Subscription":
            new_lines.append('\n')
            new_lines.append('    client: Mapped["Patient"] = relationship("Patient", foreign_keys=[client_id])\n')
            new_lines.append('    nutritionist: Mapped["Nutritionist"] = relationship("Nutritionist", foreign_keys=[nutritionist_id])\n')
            new_lines.append('    sessions: Mapped[List["ConsultationSession"]] = relationship("ConsultationSession", back_populates="subscription", cascade="all, delete-orphan")\n')
        elif class_name == "ConsultationSession":
            new_lines.append('\n')
            new_lines.append('    subscription: Mapped["Subscription"] = relationship("Subscription", back_populates="sessions")\n')
            new_lines.append('    client: Mapped["Patient"] = relationship("Patient", foreign_keys=[client_id])\n')
            new_lines.append('    nutritionist: Mapped["Nutritionist"] = relationship("Nutritionist", foreign_keys=[nutritionist_id])\n')
    else:
        new_lines.append(line)
    i += 1

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Fix applied successfully")
