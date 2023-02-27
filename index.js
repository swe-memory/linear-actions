const linear = require('@linear/sdk');
const core = require('@actions/core');
const github = require('@actions/github');

const extract = (branchName) => {
  const regex = /[Ss][Ww][Ee]-[1-9][0-9]*/;
  return(branchName.match(regex));
}

// Get the client based on authentication type
const getClient = (auth_type, auth_key) => {
  if(auth_type === 'apiKey'){
    // Get the api key
    const linearClient = new linear.LinearClient({
      apiKey: auth_key
    })
    return linearClient;
  }
  else if(auth_type === 'accessToken'){
    // Get the access token
    const linearClient = new linear.LinearClient({
      accessToken: auth_key
    })
    return linearClient;
  }
  else{
    return new linear.LinearClient();
  }

}

const getIssue = async (linearClient, issueID) => {
  const targetIssue = await linearClient.issue(issueID);
  console.log(targetIssue);
  return targetIssue;
}

const autoComment = async (token, issueID, targetIssue) => {
  if(token){
    const octokit = github.getOctokit(token);
    const { context } = github;
    const { pull_request } = context.payload;
    console.log(pull_request);
    const { data } = await octokit.rest.issues.createComment({
      ...context.repo,
      issue_number: pull_request.number,
      body: `@${pull_request.user.login} Please follow this format for PR title:\n
      [${issueID}] ${targetIssue.title}`
    })
    return data;
  }
}

const main = async () => {
  try {
    // Extract issue ID from branch name
    const branchName = core.getInput('branch_name');
    console.log(`Current branch: ${branchName}`);
    const found = extract(branchName);

    if(found){
      const issueID = found[0].toUpperCase();

      const linearClient = getClient(core.getInput('linear_auth_type'), core.getInput('linear_auth_key'));

      let targetIssue = { title: 'Not Found' };
      targetIssue = await getIssue(linearClient, issueID);

      const data = await autoComment(core.getInput('token'), issueID, targetIssue);
    }

  } catch (error) {
    core.setFailed(error.message);
  }
};

main();