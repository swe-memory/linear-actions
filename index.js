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
      const issueID = found[0].toUpperCase();
      let targetIssue = { title: 'Not Found' }
      // Get the authentication type
      const auth_type = core.getInput('linear_auth_type');

      if(auth_type === 'apiKey'){
        // Get the api key
        const apiKey = core.getInput('linear_auth_key');
        const linearClient = new linear.LinearClient({
          apiKey: apiKey
        })
        targetIssue = await linearClient.issue(issueID);
        console.log(targetIssue);
      }
      else if(auth_type === 'accessToken'){
        // Get the access token
        const accessToken = core.getInput('linear_auth_key');
        const linearClient = new linear.LinearClient({
          accessToken: accessToken
        })
        targetIssue = await linearClient.issue(issueID);
        console.log(targetIssue);
      }

      const token = core.getInput('token');
      if(token){
        const octokit = github.getOctokit(token);
        const { context } = github;
        const { pull_request } = context.payload;
        const { data } = await octokit.rest.issues.createComment({
          ...context.repo,
          issue_number: pull_request.number,
          body: `@${pull_request.user.login} [${issueID}] ${targetIssue.title}`
        })
      }

    }

  } catch (error) {
    core.setFailed(error.message);
  }
};

main();