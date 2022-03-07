@feature @request @agent
Feature: Request a Notice of Letting to a Disqualified Person from the Home Office
  An agent user should be able to complete the form

  Scenario: Complete 'request' application - single tenant, agent
    Given I start a 'request'
    Then I fill the address fields with correct information
    Then I fill the 'tenancy-start' date
    Then I add a tenant with full information
    Then I do not add another tenant
    Then I set the user as 'agent'
    Then I fill the 'agent' address fields with correct information
    Then I fill 'landlord-name-agent' with 'name'
    Then I submit the page
    Then I use the same address as previously provided
    Then I should be on the 'confirm' page
    Then I submit the page
    Then I should be on the 'declaration' page
    Then I submit the page
    Then I should be on the 'confirmation' page

  Scenario: Complete 'request' application - multiple tenants, agent
    Given I start a 'request'
    Then I fill the address fields with correct information
    Then I fill the 'tenancy-start' date
    Then I add a tenant with full information
    Then I add another tenant
    Then I add a tenant with full information
    Then I do not add another tenant
    Then I set the user as 'agent'
    Then I fill the 'agent' address fields with correct information
    Then I fill 'landlord-name-agent' with 'name'
    Then I submit the page
    Then I use the same address as previously provided
    Then I should be on the 'confirm' page
    Then I submit the page
    Then I should be on the 'declaration' page
    Then I submit the page
    Then I should be on the 'confirmation' page
