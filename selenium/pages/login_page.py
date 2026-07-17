import sys
import os
from selenium.webdriver.common.by import By

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pages.base_page import BasePage

class LoginPage(BasePage):
    # Locators
    EMAIL_INPUT = (By.ID, "auth-email")
    PASSWORD_INPUT = (By.ID, "auth-password")
    SUBMIT_BUTTON = (By.CSS_SELECTOR, '#login-form button[type="submit"]')
    GO_SIGNUP_LINK = (By.ID, "go-signup")
    EMAIL_ERROR = (By.ID, "email-error")
    PASSWORD_ERROR = (By.ID, "password-error")

    def __init__(self, driver):
        super().__init__(driver)

    def login(self, email, password):
        self.logger.info(f"Attempting login with email: {email}")
        self.enter_text(self.EMAIL_INPUT, email)
        self.enter_text(self.PASSWORD_INPUT, password)
        self.click(self.SUBMIT_BUTTON)

    def navigate_to_signup(self):
        self.logger.info("Navigating to signup screen")
        self.click(self.GO_SIGNUP_LINK)

    def get_email_error(self):
        return self.get_text(self.EMAIL_ERROR)

    def get_password_error(self):
        return self.get_text(self.PASSWORD_ERROR)
