import sys
import os
from selenium.webdriver.common.by import By

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pages.base_page import BasePage

class PatientListPage(BasePage):
    # Sidebar tabs for Doctor
    TAB_DASHBOARD = (By.CSS_SELECTOR, '.sidebar-item[data-tab="home"]')
    TAB_REVIEW_CENTER = (By.CSS_SELECTOR, '.sidebar-item[data-tab="patients"]')
    DOC_LOGOUT_BUTTON = (By.ID, "doc-btn-logout")

    # Patient scan list items & sign-off
    SIGN_OFF_BUTTONS = (By.CLASS_NAME, "btn-sign-off")
    SCAN_ITEMS = (By.CSS_SELECTOR, ".activity-list .activity-item")
    APPOINTMENT_ROWS = (By.CSS_SELECTOR, ".doctor-table tbody tr")

    def __init__(self, driver):
        super().__init__(driver)

    def navigate_to_dashboard(self):
        self.logger.info("Doctor navigating to Dashboard tab")
        self.click(self.TAB_DASHBOARD)

    def navigate_to_review_center(self):
        self.logger.info("Doctor navigating to Review Center / Patient List tab")
        self.click(self.TAB_REVIEW_CENTER)

    def get_pending_scans_count(self):
        self.navigate_to_review_center()
        try:
            items = self.driver.find_elements(*self.SCAN_ITEMS)
            return len(items)
        except Exception:
            return 0

    def sign_off_first_scan(self):
        self.logger.info("Doctor signing off on first flagged lung scan")
        self.navigate_to_review_center()
        self.click(self.SIGN_OFF_BUTTONS)
        # Handle simple alert prompt immediately
        try:
            alert = self.driver.switch_to.alert
            alert_text = alert.text
            self.logger.info(f"Dismissing signature alert: {alert_text}")
            alert.accept()
        except Exception:
            self.logger.warn("No alert found during sign-off")

    def get_appointments_count(self):
        self.navigate_to_dashboard()
        try:
            rows = self.driver.find_elements(*self.APPOINTMENT_ROWS)
            # check if there is an empty placeholder
            if len(rows) == 1 and "No consultations" in rows[0].text:
                return 0
            return len(rows)
        except Exception:
            return 0

    def logout_doctor(self):
        self.logger.info("Logging out doctor user")
        self.click(self.DOC_LOGOUT_BUTTON)
