import os
import sys
import time
import random
from selenium import webdriver
from selenium.webdriver.firefox.options import Options

if os.environ.get('GRID_BROWSER') is None or os.environ.get('GRID_PLATFORM') is None:
	print('\nEnvironment variables GRID_BROWSER and GRID_PLATFORM must be set')
	print('Canceling Selenium Grid tests...')
	sys.exit(1)

# Global variable initialization
g_total_tests = 0
g_tests_ran = 0
g_passed_tests = 0
g_failed_tests = 0
g_grid_hub_url = 'http://192.168.1.167:4444/wd/hub'
print(os.environ.get('GRID_ENV'))
if os.environ.get('GRID_ENV') == 'STAGE':
    g_app_base_url = 'http://192.168.1.177:8080'
else:
    g_app_base_url = 'http://192.168.1.174:8080'
g_options = Options()
g_options.AcceptInsecureCertificates = True
g_driver = webdriver.Remote(
    options=g_options,
    command_executor = g_grid_hub_url,
    desired_capabilities = {
        'browserName': os.environ.get('GRID_BROWSER'),
        'platform': os.environ.get('GRID_PLATFORM')
    }
)

def main():
    global g_driver, g_total_tests
    # Test 1: Reach the login route
    g_total_tests += 1
    g_driver.get(app_route('/login'))
    time.sleep(1)
    test_comparison(g_driver.title, 'Login', 'Reached /login route')
    # Test 2: Reach the signup route
    g_total_tests += 1
    g_driver.get(app_route('/signup'))
    time.sleep(1)
    test_comparison(g_driver.title, 'Signup', 'Reached /signup route')
    # Generate a test user
    print('\nGenerating Random User Info...')
    username = 'user_' + new_random_string(5)
    password = new_random_string()
    print('Username:\t' + username + '\nPassword:\t' + password)
    # Test 3: Test Password Confirmation Check
    g_total_tests += 1
    g_driver.find_element_by_id('username_input').send_keys(username)
    g_driver.find_element_by_id('password_input').send_keys(password)
    g_driver.find_element_by_id('password_confirmation_input').send_keys('incorrect_password')
    g_driver.find_element_by_id('submit_button').click()
    time.sleep(1)
    test_comparison(g_driver.find_element_by_class_name('flashes').text, 'Password and Confirmation do not match', 'Password confirmation check works')
    # Test 4: Sign up a test user account
    g_total_tests += 1
    g_driver.find_element_by_id('password_input').send_keys(password)
    g_driver.find_element_by_id('password_confirmation_input').send_keys(password)
    g_driver.find_element_by_id('submit_button').click()
    time.sleep(1)
    test_comparison(g_driver.title, 'Feed', 'Created new user, auto logged in')
    # Test 5: Log out
    g_total_tests += 1
    g_driver.get(app_route('/logout'))
    time.sleep(1)
    test_comparison(g_driver.title, 'Login', 'Redirected to /login route after logout')
    # Test 6: Log in to existing test user account
    g_total_tests += 1
    g_driver.find_element_by_id('username_input').send_keys(username)
    g_driver.find_element_by_id('password_input').send_keys(password)
    g_driver.find_element_by_id('submit_button').click()
    time.sleep(1)
    test_comparison(g_driver.title, 'Feed', 'Logged into existing user')
    # Test 7: Post 'Hello, world!'
    g_total_tests += 1
    g_driver.find_element_by_id('post_body_input').send_keys('Hello, world!')
    g_driver.find_element_by_id('submit_button').click()
    time.sleep(1)
    g_driver.get(app_route('/users/' + username))
    time.sleep(1)
    post_author = g_driver.find_element_by_class_name('post_author').text
    post_body = g_driver.find_element_by_class_name('post_body').text
    test_comparison(post_author + ' says "' + post_body + '"', username + ' says "Hello, world!"', 'Posted "Hello, World!"')
    #
    print_summary()
    g_driver.close()
    sys.exit(0)

def app_route(route_string):
    global g_app_base_url
    return g_app_base_url + route_string

def test_comparison(found, expected, test_details):
    global g_tests_ran, g_passed_tests, g_failed_tests
    g_tests_ran += 1
    print('\nTest #' + str(g_tests_ran) + '\n' + str(type(found)).split("'")[1].capitalize() + ' Found:\t' + str(found) + '\n' + str(type(expected)).split("'")[1].capitalize() + ' Expected:\t' + str(expected))
    if found == expected:
        g_passed_tests += 1
        print('[PASS] ' + test_details)
    else:
        g_failed_tests += 1
        print('[FAIL] ' + test_details)

def print_summary():
    global g_total_tests, g_tests_ran, g_passed_tests, g_failed_tests
    print('\nSummary:\nPlatform: ' + os.environ.get('GRID_PLATFORM') + '\nBrowser: ' + os.environ.get('GRID_BROWSER') + '\n' + str(g_tests_ran) + '/' + str(g_total_tests) + ' tests ran\n' + str(g_passed_tests) + '/' + str(g_tests_ran) + ' tests passed\n' + str(g_failed_tests) + '/' + str(g_tests_ran) + ' tests failed')

def new_random_string(length=10):
    alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
    return ''.join((random.choice(alphabet) for i in range(length)))

if __name__ == '__main__':
    main()