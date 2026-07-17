import sys
import os
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

# Add parent directory to path to resolve local imports cleanly and avoid conflicts with library name
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.log_utils import get_logger

class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.logger = get_logger(self.__class__.__name__)

    def find_element(self, locator, timeout=10):
        try:
            return WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located(locator)
            )
        except TimeoutException:
            self.logger.error(f"Element with locator {locator} not found within {timeout}s")
            raise

    def click(self, locator, timeout=10):
        try:
            element = WebDriverWait(self.driver, timeout).until(
                EC.element_to_be_clickable(locator)
            )
            element.click()
        except Exception as e:
            self.logger.error(f"Failed to click element with locator {locator}: {str(e)}")
            raise

    def enter_text(self, locator, text, timeout=10):
        try:
            element = self.find_element(locator, timeout)
            element.clear()
            element.send_keys(text)
        except Exception as e:
            self.logger.error(f"Failed to send keys to element with locator {locator}: {str(e)}")
            raise

    def get_text(self, locator, timeout=10):
        try:
            element = self.find_element(locator, timeout)
            return element.text
        except Exception as e:
            self.logger.error(f"Failed to get text from element with locator {locator}: {str(e)}")
            raise

    def is_displayed(self, locator, timeout=5):
        try:
            return WebDriverWait(self.driver, timeout).until(
                EC.visibility_of_element_located(locator)
            ).is_displayed()
        except TimeoutException:
            return False

    def capture_screenshot(self, name):
        screenshots_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'screenshots')
        os.makedirs(screenshots_dir, exist_ok=True)
        screenshot_path = os.path.join(screenshots_dir, f"{name}.png")
        self.driver.save_screenshot(screenshot_path)
        self.logger.info(f"Screenshot saved to: {screenshot_path}")
        return screenshot_path

    def detect_current_page(self):
        """
        Automatically detects which page is currently loaded in the browser.
        Returns a string representing the page name:
        'splash', 'onboarding', 'login', 'patient_dashboard', 'doctor_dashboard', 'patient_form', 'image_upload', 'reports', or 'unknown'
        """
        # 1. Splash Page Signature
        if self.is_displayed((By.CLASS_NAME, "splash-container"), timeout=1):
            return "splash"
        # 2. Onboarding Page Signature
        if self.is_displayed((By.CLASS_NAME, "onboarding-container"), timeout=1):
            return "onboarding"
        # 3. Login Page Signatures
        if self.is_displayed((By.ID, "login-form"), timeout=1):
            return "login"
        # 4. Patient Profile Edit Form Signature
        if self.is_displayed((By.ID, "profile-edit-form"), timeout=1):
            return "patient_form"
        # 5. Reports Page Signature
        if self.is_displayed((By.ID, "compile-pdf-btn"), timeout=1):
            return "reports"
        # 6. Image Upload Page Signature
        if self.is_displayed((By.ID, "ct-file-input"), timeout=1):
            return "image_upload"
        # 7. Patient Dashboard Signature
        if self.is_displayed((By.ID, "patient-app"), timeout=1):
            return "patient_dashboard"
        # 8. Doctor Dashboard Signature
        if self.is_displayed((By.CLASS_NAME, "doctor-layout"), timeout=1):
            return "doctor_dashboard"

        return "unknown"
