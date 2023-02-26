const linear = require('@linear/sdk');
const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {
  try {
    // Extract issue ID from branch name
    const branchName = core.getInput('branch_name');
    console.log(`Current branch: ${branchName}`);
    const regex = /[Ss][Ww][Ee]-[1-9][0-9]*/;
    const found = branchName.match(regex);

    if(found){
      core.setOutput("issue_id", found[0].toUpperCase());

      const auth_type = core.getInput('linear_auth_type');

      if(auth_type === 'apiKey'){
        const apiKey = core.getInput('linear_auth_key');
        const linearClient = new linear.LinearClient({
          apiKey: apiKey
        })
        const targetIssue = await linearClient.issue(found[0].toUpperCase());
        console.log(targetIssue);
      }
      else if(auth_type === 'accessToken'){
        const accessToken = core.getInput('linear_auth_key');
        const linearClient = new linear.LinearClient({
          accessToken: accessToken
        })
        const targetIssue = await linearClient.issue(found[0].toUpperCase());
        console.log(targetIssue);
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
};

main();