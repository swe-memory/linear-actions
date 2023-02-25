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
      - name: Extract
        id: extract
        uses: YoNG-Zaii/linear-actions@v1.0
        with:
          branch_name: ${{ github.ref_name }}

      - name: Output
        run: echo "${{ steps.extract.outputs.issue_id }}"
```