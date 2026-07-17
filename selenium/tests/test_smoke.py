import sys
import os
import pytest

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pages.login_page import LoginPage

import time
from selenium.webdriver.common.by import By

def test_app_load_and_login_detection(driver):
    """
    Smoke test to verify that the application loads, bypasses onboarding,
    and detects the login page signature successfully.
    """
    driver.get("http://127.0.0.1:8000")
    
    login_page = LoginPage(driver)
    
    # Wait up to 5 seconds to load and bypass splash
    timeout = 5
    start_time = time.time()
    detected_page = "unknown"
    while time.time() - start_time < timeout:
        detected_page = login_page.detect_current_page()
        if detected_page in ["onboarding", "login"]:
            break
        time.sleep(0.5)

    login_page.logger.info(f"Page after splash: {detected_page}")

    # If it is onboarding, click Skip to go to Login Page
    if detected_page == "onboarding":
        login_page.logger.info("Onboarding screen detected, clicking 'Skip'")
        login_page.click((By.ID, "onboarding-skip"))
        # Wait a moment for transition
        time.sleep(1)
        detected_page = login_page.detect_current_page()

    login_page.logger.info(f"Final detected current page: {detected_page}")
    
    assert detected_page == "login", f"Expected 'login' page, but detected '{detected_page}'"
