---
paths:
  - '**/*.njk'
---

# HTML coding guidelines

## GOV.UK design system components reference

Use macros to render GOV.UK design system components, rather than raw HTML, so that we pick up changes to the component HTML structure automatically.

| Component     | CSS class pattern     | Macro reference                                                                               |
| ------------- | --------------------- | --------------------------------------------------------------------------------------------- |
| Button        | `govuk-button`        | https://design-system.service.gov.uk/components/button/#button-example-nunjucks               |
| Error message | `govuk-error-message` | https://design-system.service.gov.uk/components/error-message/#error-message-example-nunjucks |
| Error summary | `govuk-error-summary` | https://design-system.service.gov.uk/components/error-summary/#error-summary-example-nunjucks |
| Radios        | `govuk-radios`        | https://design-system.service.gov.uk/components/radios/#radios-example-nunjucks               |
| Checkboxes    | `govuk-checkboxes`    | https://design-system.service.gov.uk/components/checkboxes/#checkboxes-example-nunjucks       |
| Panel         | `govuk-panel`         | https://design-system.service.gov.uk/components/panel/#panel-example-nunjucks                 |
| Table         | `govuk-table`         | https://design-system.service.gov.uk/components/table/#table-example-nunjucks                 |
