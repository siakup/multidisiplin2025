import json

try:
    with open('test_results.json', 'r') as f:
        data = json.load(f)
        failed_tests = [test['name'] for test in data.get('testResults', []) if test.get('status') == 'failed']
        if failed_tests:
            print("FAILED_FILES:")
            for test in failed_tests:
                print(test)
        else:
            print("No failed tests found in JSON.")
except Exception as e:
    print(f"Error parsing JSON: {e}")
