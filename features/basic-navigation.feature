Feature: Basic Navigation
  As a user
  I want to navigate to the application
  So that I can see the homepage

  Scenario: Visit homepage
    Given I open the application
    Then I should see "Vite + React" heading
