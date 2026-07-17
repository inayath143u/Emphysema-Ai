import sys
import os
from selenium.webdriver.common.by import By

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pages.base_page import BasePage

class PatientFormPage(BasePage):
    # Locators
    NAME_INPUT = (By.ID, "profile-name")
    BIO_INPUT = (By.ID, "profile-bio")
    BIOMETRIC_TOGGLE = (By.ID, "profile-bio-toggle")
    SAVE_BUTTON = (By.CSS_SELECTOR, '#profile-edit-form button[type="submit"]')

    def __init__(self, driver):
        super().__init__(driver)

    def update_profile(self, name, bio, enable_biometrics=None):
        self.logger.info(f"Updating profile details to Name: {name}, Bio: {bio}")
        self.enter_text(self.NAME_INPUT, name)
        self.enter_text(self.BIO_INPUT, bio)

        if enable_biometrics is not None:
            checkbox = self.find_element(self.BIOMETRIC_TOGGLE)
            is_selected = checkbox.is_selected()
            if is_selected != enable_biometrics:
                self.logger.info(f"Toggling biometric checkbox to {enable_biometrics}")
                # We click the parent or direct checkbox
                self.click(self.BIOMETRIC_TOGGLE)

        self.click(self.SAVE_BUTTON)

    def get_profile_name(self):
        element = self.find_element(self.NAME_INPUT)
        return element.get_attribute("value")

    def get_profile_bio(self):
        element = self.find_element(self.BIO_INPUT)
        return element.get_attribute("value")

    def is_biometric_enabled(self):
        element = self.find_element(self.BIOMETRIC_TOGGLE)
        return element.is_selected()
