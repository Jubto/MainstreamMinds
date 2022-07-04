from typing import Callable, Any


class ModelFieldsMapping:
    _mappings = {}

    def add_field_mapping(self, field_to_map: str, output_field: str, value_mapping_func: Callable = None):
        self._mappings[field_to_map] = (output_field, value_mapping_func)

    def map_field(self, field_name: str, field_value: Any):
        mapping = self._mappings.get(field_name, None)
        if not mapping:
            return field_name, field_value

        if mapping[1] is not None:
            field_value = mapping[1](field_value)
        return mapping[0], field_value


def assign_members_from_dict(class_instance: object, dict_to_assign: dict,
                             field_mappings: ModelFieldsMapping = None):
    for field, value in dict_to_assign.items():
        if field_mappings:
            field, value = field_mappings.map_field(field, value)
            print(field, value)
        setattr(class_instance, field, value)
