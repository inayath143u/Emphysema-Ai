import os
import sys
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from utils.log_utils import get_logger
from utils.excel_logger import ExcelLogger

logger = get_logger("Conftest")

def pytest_addoption(parser):
    parser.addoption(
        "--headless", action="store_true", default=False, help="Run Chrome browser in headless mode"
    )

@pytest.fixture(scope="function")
def driver(request):
    headless = request.config.getoption("--headless")
    logger.info(f"Initializing Chrome WebDriver (headless={headless})...")

    options = webdriver.ChromeOptions()
    if headless:
        options.add_argument("--headless")
        options.add_argument("--disable-gpu")
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")

    # Disable automation banner and infobars
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)

    # Initialize Chrome driver via webdriver_manager
    service = ChromeService(ChromeDriverManager().install())
    driver_instance = webdriver.Chrome(service=service, options=options)
    driver_instance.maximize_window()

    yield driver_instance

    logger.info("Tearing down Chrome WebDriver instance...")
    driver_instance.quit()

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    # execute all other hooks to obtain the report object
    outcome = yield
    rep = outcome.get_result()

    # we only look at actual test execution failure, not setup/teardown
    if rep.when == "call":
        test_name = item.name
        status = "PASSED" if rep.passed else "FAILED"
        error_message = "-"
        screenshot_rel_path = "-"

        if rep.failed:
            error_message = str(rep.longrepr)[:250] # limit error length for excel formatting
            # Check if driver fixture is present in the test arguments
            if "driver" in item.fixturenames:
                driver_instance = item.funcargs.get("driver")
                if driver_instance:
                    screenshots_dir = os.path.join(os.path.dirname(__file__), 'screenshots')
                    os.makedirs(screenshots_dir, exist_ok=True)
                    screenshot_path = os.path.join(screenshots_dir, f"{test_name}.png")
                    try:
                        driver_instance.save_screenshot(screenshot_path)
                        screenshot_rel_path = os.path.join('screenshots', f"{test_name}.png")
                        logger.error(f"Test '{test_name}' FAILED. Screenshot saved to: {screenshot_path}")
                    except Exception as e:
                        logger.error(f"Failed to capture failure screenshot for test '{test_name}': {str(e)}")

        # Log results to Excel Logger
        try:
            ExcelLogger.log_test_result(test_name, status, error_message, screenshot_rel_path)
            logger.info(f"Test '{test_name}' results logged to Excel database (status={status}).")
        except Exception as e:
            logger.error(f"Failed to write results to Excel database: {str(e)}")
