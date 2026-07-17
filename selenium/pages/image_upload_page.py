import sys
import os
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pages.base_page import BasePage

class ImageUploadPage(BasePage):
    # Locators
    FILE_INPUT = (By.ID, "ct-file-input")
    BACK_BUTTON = (By.ID, "scan-back-btn")
    MODE_UPLOAD_TAB = (By.ID, "mode-upload-tab")
    MODE_CAMERA_TAB = (By.ID, "mode-camera-tab")
    SHUTTER_BUTTON = (By.ID, "shutter-btn")

    # Processing and Results Screen Locators
    PROCESSING_BAR = (By.ID, "processing-bar")
    PROCESSING_STATUS = (By.ID, "processing-status")
    DIAGNOSTIC_HEADER = (By.XPATH, "//h2[text()='Diagnostic Report']")
    DIAGNOSTIC_SEVERITY = (By.CSS_SELECTOR, ".health-status-badge")

    def __init__(self, driver):
        super().__init__(driver)

    def upload_lung_image(self, file_path):
        self.logger.info(f"Uploading file: {file_path}")
        self.click(self.MODE_UPLOAD_TAB)
        # Uploading requires sending absolute path to the file input
        file_input_el = self.find_element(self.FILE_INPUT)
        file_input_el.send_keys(os.path.abspath(file_path))

    def simulate_live_capture(self):
        self.logger.info("Switching to Camera tab and triggering simulated capture")
        self.click(self.MODE_CAMERA_TAB)
        self.click(self.SHUTTER_BUTTON)

    def wait_for_processing_complete(self, timeout=20):
        self.logger.info("Waiting for AI analysis processing to complete...")
        # Wait for processing bar to disappear and diagnostic screen to appear
        WebDriverWait(self.driver, timeout).until(
            EC.visibility_of_element_located(self.DIAGNOSTIC_HEADER)
        )
        self.logger.info("AI analysis completed successfully.")

    def get_diagnostic_severity_index(self):
        text = self.get_text(self.DIAGNOSTIC_SEVERITY)
        self.logger.info(f"AI Diagnostics severity index found: {text}")
        return text
