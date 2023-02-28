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
        uses: swe-memory/linear-actions@v2.2
        with:
          token: ${{ github.token }}
          linear_id_prefix: "swe"
          linear_auth_type: "apiKey"
          linear_auth_key: ${{ secrets.LINEAR_APIKEY }}
          label_name: "bad PR title"
          label_description: "PR title needs formatting"
          label_color: "D4C5F9"
```

## Inputs
| Attributes          |    Description                               |  Default Value                 | Example Values                       |
|:-------------------:|:--------------------------------------------:|-------------------------------:|-------------------------------------:|
| token               | GitHub authentication token                  | "" (Empty string)              | secrets.GITHUB_TOKEN, github.token   |
| linear_id_prefix    | Linear issue ID prefix                       | ""                             | "SWE", "SCSE", "test"                |
| linear_auth_type    | Linear authentication type                   | ""                             | "apiKey" or "accessToken" only       |
| linear_auth_key     | Linear authentication key                    | ""                             | Can be found in Linear app           |
| label_name          | Label for non-aligned PR title               | "bad PR title"                 | "recheck PR title"                   |
| label_description   | Label description for non-aligned PR title   | "PR title needs formatting"    | "PR title needs adjustment"          |
| label_color         | Label color for non-aligned PR title         | "D4C5F9"                       | "0052CC"                             |

## Mechanism

1. Prequisite: the branch name must contain extractable Linear issue ID. E.g.: <code>test/swe-5</code>.
2. If the branch name does not contain extractable Linear issue ID, the workflow will succeed without validation.