# Linear Actions

```yaml
name: "PR Title Validation (Linear-Based)"

on:
  pull_request_target:
    types:
      - opened
      - edited
      - synchronize
      - labeled
      - unlabeled

jobs:
  PR-title-linear-validation:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Title validation
        id: validate
        uses: swe-memory/linear-actions@v2.0
        with:
          token: ${{ github.token }}
          linear_auth_type: "apiKey"
          linear_auth_key: ${{ secrets.LINEAR_APIKEY }}
          label_name: "bad PR title"
          label_description: "PR title needs formatting"
          label_color: "D4C5F9"
```