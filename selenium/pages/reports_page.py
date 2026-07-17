import sys
import os
from selenium.webdriver.common.by import By

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pages.base_page import BasePage

class ReportsPage(BasePage):
    # Locators
    START_DATE_INPUT = (By.ID, "rep-start-date")
    END_DATE_INPUT = (By.ID, "rep-end-date")
    BACK_BUTTON = (By.ID, "rep-back-btn")
    COMPILE_PDF_BUTTON = (By.ID, "compile-pdf-btn")

    def __init__(self, driver):
        super().__init__(driver)

    def generate_report(self, start_date, end_date):
        self.logger.info(f"Generating PDF report from {start_date} to {end_date}")
        self.enter_text(self.START_DATE_INPUT, start_date)
        self.enter_text(self.END_DATE_INPUT, end_date)
        self.click(self.COMPILE_PDF_BUTTON)

    def go_back(self):
        self.logger.info("Clicking back button to return to dashboard")
        self.click(self.BACK_BUTTON)
