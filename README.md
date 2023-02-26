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
  Linear Issue ID Validation:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Extract
        id: extract
        uses: swe-memory/linear-actions@v1.5
        with:
          branch_name: ${{ github.head_ref }}
          linear_auth_type: 'apiKey'
          linear_auth_key: ${{ secrets.LINEAR_APIKEY }}

      - name: Output
        run: echo "${{ steps.extract.outputs.issue_id }}"
```