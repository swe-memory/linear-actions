const linear = require('@linear/sdk');
const core = require('@actions/core');
const github = require('@actions/github');

// Extract issue ID from branch name
const getIssueID = (payload) => {
  const regex = /[Ss][Ww][Ee]-[1-9][0-9]*/;
  const branchName = payload.head.ref;
  const found = branchName.match(regex);
  if(found)
    return found[0].toUpperCase();
  return null;
}

// Get the client based on authentication type
const getClient = (authType, authKey) => {
  if(authType === 'apiKey'){
    // Get the api key
    const linearClient = new linear.LinearClient({
      apiKey: authKey
    })
    return linearClient;
  }
  else if(authType === 'accessToken'){
    // Get the access token
    const linearClient = new linear.LinearClient({
      accessToken: authKey
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

const autoComment = async (context, octokit, issueID, targetIssue) => {
    const { pull_request } = context.payload;
    const { data } = await octokit.rest.issues.createComment({
      ...context.repo,
      issue_number: pull_request.number,
      body: `@${pull_request.user.login} Please follow this format for PR title:\n
      [${issueID}] ${targetIssue.title}`
    })
    return data;
}

const main = async () => {
  try {

    const token = core.getInput('token');

    if(token){
      const octokit = github.getOctokit(token);
      const { context } = github;
      const { pull_request } = context.payload;
      console.log(pull_request);

      // Issue ID in uppercase
      const issueID = getIssueID(pull_request);

      if(issueID){
        const linearClient = getClient(core.getInput('linear_auth_type'), core.getInput('linear_auth_key'));

        let targetIssue = { title: 'Not Found' };
        targetIssue = await getIssue(linearClient, issueID);
  
        const data = await autoComment(context, octokit, issueID, targetIssue);
      }
    }

  } catch (error) {
    core.setFailed(error.message);
  }
};

main();