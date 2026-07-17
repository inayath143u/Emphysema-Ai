import sys
import os
from selenium.webdriver.common.by import By

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pages.base_page import BasePage

class DashboardPage(BasePage):
    # Patient Dashboard Navigation tabs
    TAB_HOME = (By.CSS_SELECTOR, '.nav-item[data-tab="home"]')
    TAB_ANALYTICS = (By.CSS_SELECTOR, '.nav-item[data-tab="analytics"]')
    TAB_CONSULT = (By.CSS_SELECTOR, '.nav-item[data-tab="consult"]')
    TAB_TOOLS = (By.CSS_SELECTOR, '.nav-item[data-tab="tools"]')
    TAB_PROFILE = (By.CSS_SELECTOR, '.nav-item[data-tab="profile"]')

    # Quick Service Grid Items
    SRV_UPLOAD = (By.ID, "srv-upload")
    SRV_EXERCISES = (By.ID, "srv-exercises")
    SRV_MEDICATION = (By.ID, "srv-medication")
    SRV_HOSPITALS = (By.ID, "srv-hospitals")

    # Logout Button (Patient profile tab)
    PATIENT_LOGOUT_BUTTON = (By.ID, "prof-logout")

    def __init__(self, driver):
        super().__init__(driver)

    def navigate_to_tab(self, tab_name):
        self.logger.info(f"Navigating to patient dashboard tab: {tab_name}")
        tab_locators = {
            "home": self.TAB_HOME,
            "analytics": self.TAB_ANALYTICS,
            "consult": self.TAB_CONSULT,
            "tools": self.TAB_TOOLS,
            "profile": self.TAB_PROFILE
        }
        if tab_name in tab_locators:
            self.click(tab_locators[tab_name])
        else:
            raise ValueError(f"Invalid tab name: {tab_name}")

    def click_service(self, service_name):
        self.logger.info(f"Clicking service: {service_name}")
        services = {
            "upload": self.SRV_UPLOAD,
            "exercises": self.SRV_EXERCISES,
            "medication": self.SRV_MEDICATION,
            "hospitals": self.SRV_HOSPITALS
        }
        if service_name in services:
            self.click(services[service_name])
        else:
            raise ValueError(f"Invalid service name: {service_name}")

    def logout_patient(self):
        self.logger.info("Logging out patient user")
        self.navigate_to_tab("profile")
        self.click(self.PATIENT_LOGOUT_BUTTON)
