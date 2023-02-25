# Linear Actions

```yaml
name: "Linear Issue ID Extraction"

on:
  pull_request_target:
    types:
      - opened
      - edited
      - synchronize
      - labeled
      - unlabeled

jobs:
  linear-issue-extaction:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Extract
        id: extract
        uses: swe-memory/linear-actions@v1.0
        with:
          branch_name: ${{ github.head_ref }}

      - name: Output
        run: echo "${{ steps.extract.outputs.issue_id }}"
```