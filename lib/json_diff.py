import json


def json_diff(json1, json2):
    """
    Compares two JSON objects, ignoring the order of elements in arrays.

    Args:
        json1: The first JSON object (dict or list).
        json2: The second JSON object (dict or list).

    Returns:
        A dictionary representing the differences, or an empty dictionary if no differences.
        The dictionary will have keys 'added', 'removed', and 'changed', each containing
        a list of paths and their respective values.
    """
    diff = {}

    def _compare_value(path, val1, val2):
        if isinstance(val1, dict) and isinstance(val2, dict):
            _compare_dict(path, val1, val2)
        elif isinstance(val1, list) and isinstance(val2, list):
            _compare_list(path, val1, val2)
        elif val1 != val2:
            # If values are different and not complex types, it's a change
            if "changed" not in diff:
                diff["changed"] = []
            diff["changed"].append({"path": path, "old_value": val1, "new_value": val2})

    def _compare_dict(current_path, dict1, dict2):
        # Check for removed keys
        for key in set(dict1.keys()) - set(dict2.keys()):
            if "removed" not in diff:
                diff["removed"] = []
            diff["removed"].append(
                {"path": f"{current_path}.{key}", "value": dict1[key]}
            )

        # Check for added keys
        for key in set(dict2.keys()) - set(dict1.keys()):
            if "added" not in diff:
                diff["added"] = []
            diff["added"].append({"path": f"{current_path}.{key}", "value": dict2[key]})

        # Check for common keys
        for key in set(dict1.keys()) & set(dict2.keys()):
            _compare_value(f"{current_path}.{key}", dict1[key], dict2[key])

    def _compare_list(current_path, list1, list2):
        # Sort elements if they are comparable (e.g., simple types, or if you define a comparison for dicts/lists)
        # This is a simplified approach, a more robust solution might involve deep comparison for each element
        # and identifying matching elements even if their order changes.
        try:
            sorted_list1 = sorted(list1, key=json.dumps)
            sorted_list2 = sorted(list2, key=json.dumps)
        except TypeError:
            # If elements are not directly comparable (e.g., dictionaries that can't be sorted by json.dumps)
            # a more advanced matching algorithm (e.g., based on item similarity or a unique ID) would be needed.
            # For this simplified diff, we'll treat them as unorderable and rely on direct comparison.
            sorted_list1 = list1
            sorted_list2 = list2

        len1 = len(sorted_list1)
        len2 = len(sorted_list2)

        # Find added/removed elements. This is a basic approach and might not reflect true changes
        # in presence of multiple identical elements.
        for i in range(max(len1, len2)):
            path = f"{current_path}[{i}]"
            if i < len1 and i < len2:
                _compare_value(path, sorted_list1[i], sorted_list2[i])
            elif i < len1:
                if "removed" not in diff:
                    diff["removed"] = []
                diff["removed"].append({"path": path, "value": sorted_list1[i]})
            elif i < len2:
                if "added" not in diff:
                    diff["added"] = []
                diff["added"].append({"path": path, "value": sorted_list2[i]})

    if isinstance(json1, dict) and isinstance(json2, dict):
        _compare_dict("$", json1, json2)
    elif isinstance(json1, list) and isinstance(json2, list):
        _compare_list("$", json1, json2)
    elif json1 != json2:
        # If the root types are different or simple values are different
        diff["changed"] = [{"path": "$", "old_value": json1, "new_value": json2}]

    return diff
