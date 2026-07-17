import os
import sys
import pytest

def main():
    selenium_dir = os.path.dirname(os.path.abspath(__file__))
    os.makedirs(os.path.join(selenium_dir, "reports"), exist_ok=True)
    os.makedirs(os.path.join(selenium_dir, "screenshots"), exist_ok=True)

    # CLI args for pytest
    args = [
        os.path.join(selenium_dir, "tests"),
        "-v",
        "--headless",  # Run Chrome in headless mode for CI/CD and speed
        f"--html={os.path.join(selenium_dir, 'reports', 'report.html')}",
        "--self-contained-html"
    ]

    print("Starting Selenium WebDriver automation tests via Pytest...")
    exit_code = pytest.main(args)
    print(f"All tests completed. Exit code: {exit_code}")
    sys.exit(exit_code)

if __name__ == "__main__":
    main()
