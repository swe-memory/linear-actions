# Linear Actions

```yaml
name: "Linear Issue ID Extraction and Query"

on:
  pull_request_target:
    types:
      - opened
      - edited
      - synchronize
      - labeled
      - unlabeled

jobs:
  Linears-issue-ID-validation:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Extract & Query
        id: extract
        uses: swe-memory/linear-actions@v1.8
        with:
          token: ${{ github.token }}
          linear_auth_type: 'apiKey'
          linear_auth_key: ${{ secrets.LINEAR_APIKEY }}
```