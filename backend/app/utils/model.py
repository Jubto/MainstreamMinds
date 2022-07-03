def assign_members_from_dict(class_instance: object, dict_to_assign: dict):
    for column, value in dict_to_assign.items():
        setattr(class_instance, column, value)
