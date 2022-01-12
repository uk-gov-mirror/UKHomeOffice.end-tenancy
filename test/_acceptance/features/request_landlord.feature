@feature @request @landlord
Feature: Request a Notice of Letting to a Disqualified Person from the Home Office
  A landlord user should be able to complete the form

  Scenario: Complete application - single tenant, landlord
    Given I start a 'request'
    Then I fill the address fields with correct information
    Then I fill the 'tenancy-start' date
    Then I add a tenant with full information
    Then I do not add another tenant
    Then I set the user as 'landlord'
    Then I use the same address as previously provided
    Then I should be on the 'confirm' page
    Then I submit the page
    Then I should be on the 'declaration' page
    Then I submit the page
    Then I should be on the 'confirmation' page

  Scenario: Complete application - multiple tenants, landlord
    Given I start a 'request'
    Then I fill the address fields with correct information
    Then I fill the 'tenancy-start' date
    Then I add a tenant with full information
    Then I add another tenant
    Then I add a tenant with full information
    Then I do not add another tenant
    Then I set the user as 'landlord'
    Then I fill the 'landlord' address fields with correct information
    Then I should be on the 'confirm' page
    Then I submit the page
    Then I should be on the 'declaration' page
    Then I submit the page
    Then I should be on the 'confirmation' page
