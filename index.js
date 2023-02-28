const linear = require('@linear/sdk');
const core = require('@actions/core');
const github = require('@actions/github');

// Extract issue ID from branch name
const getIssueID = (payload, idPrefix) => {
  // const regex = /[Ss][Ww][Ee]-[1-9][0-9]*/;
  let regexString = "";
  for(let i = 0; i < idPrefix.length; i++)
    regexString += `[${idPrefix[i].toUpperCase()}${idPrefix[i].toLowerCase()}]`
  regexString += `-[1-9][0-9]*`;

  const regex = new RegExp(regexString);
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

// Get the Linear issue by issue ID
const getIssue = async (linearClient, issueID) => {
  const targetIssue = await linearClient.issue(issueID);
  // console.log(targetIssue);
  return targetIssue;
}

// Check exact matching of title
const checkTitle = (payload, targetIssue) => {
  const pullRequestTitle = payload.title;
  const actualTitle = `[${targetIssue.identifier}] ${targetIssue.title}`; 
  if(pullRequestTitle === actualTitle)
    return true;
  return false;
}

// Check whether label exists
const checkLabel = async (context, octokit, labelName) => {
  try{
    await octokit.rest.issues.getLabel({
      ...context.repo,
      name: labelName
    })
    return true;
  }
  catch (error) {
    return false;
  }
}

const createLabel = async (context, octokit, labelName, labelDesc, labelColor) => {
  await octokit.rest.issues.createLabel({
    ...context.repo,
    name: labelName,
    description: labelDesc,
    color: labelColor
  })
}

const addLabels = async (context, octokit, labelName) => {
  const { pull_request } = context.payload;
  await octokit.rest.issues.addLabels({
    ...context.repo,
    issue_number: pull_request.number,
    labels: [labelName]
  })
}

// Autocomment if bad PR title
const autoComment = async (context, octokit, issueID, targetIssue) => {
    const { pull_request } = context.payload;
    await octokit.rest.issues.createComment({
      ...context.repo,
      issue_number: pull_request.number,
      body: `@${pull_request.user.login} Please follow this format for PR title:
\`\`\`
[${issueID}] ${targetIssue.title}
\`\`\``
    })
}

// Remove label if good PR title
const removeLabel = async (context, octokit, labelName) => {
  try{
    const { pull_request } = context.payload;
    await octokit.rest.issues.removeLabel({
      ...context.repo,
      issue_number: pull_request.number,
      name: labelName
    })
  } catch(error){
    return
  }
}

const main = async () => {
  try {

    const token = core.getInput('token');

    if(token){
      const octokit = github.getOctokit(token);
      const { context } = github;
      const { pull_request } = context.payload;
      // console.log(pull_request);

      // Issue ID in uppercase
      const issueID = getIssueID(pull_request, core.getInput('linear_id_prefix'));
      
      if(issueID){
        const linearClient = getClient(core.getInput('linear_auth_type'), core.getInput('linear_auth_key'));

        let targetIssue = { title: 'Not Found' };
        targetIssue = await getIssue(linearClient, issueID);

        const labelName = core.getInput('label_name');
        if(!checkTitle(pull_request, targetIssue)){
          
          if(!await checkLabel(context, octokit, labelName))
            await createLabel(context, octokit, labelName, core.getInput('label_description'), core.getInput('label_color'));
          
          await addLabels(context, octokit, labelName);
          await autoComment(context, octokit, issueID, targetIssue);
          throw new Error('PR title needs formatting');
        }
        else
            await removeLabel(context, octokit, labelName);
      }
      else{
        console.log('No extractable issue ID from branch name')
      }
    }

  } catch (error) {
    core.setFailed(error.message);
  }
};

main();