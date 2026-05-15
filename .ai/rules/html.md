---
paths:
  - '**/*.njk'
---

# HTML coding guidelines

## Date formatting

All dates displayed to users must use the GOV.UK date format: day month-name year with no leading zero on the day (e.g. "5 June 2025", not "05/06/2025").

- Format dates in the Nunjucks template, not in the controller or service layer — controllers must pass raw date values (ISO strings or Date objects) to the view
- Use a Nunjucks filter or macro to apply the format (e.g. `{{ application.createdAt | govukDate }}`); do not pre-format dates in JavaScript before passing them to `h.view()`
- Defining the filter: add a `govukDate` filter to the Nunjucks environment in the server setup (or reuse one already defined in the project) that converts the value using `Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })` or equivalent
- If the value is null, undefined, or an invalid date, the filter must return a hyphen `–` rather than throwing or rendering a fallback epoch date

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
