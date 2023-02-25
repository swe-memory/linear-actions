const linear = require('@linear/sdk');
const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {
  try {
    const branchName = core.getInput('branch_name');
    const apiKey = core.getInput('linear_api_key');
    console.log(`Current branch: ${branchName}`);

    const regex = /[Ss][Ww][Ee]-[1-9][0-9]*/;
    const found = branchName.match(regex);
    console.log(found);
    core.setOutput("issue_id", found[0].toUpperCase());

    if(found){
      const linearClient = new linear.LinearClient({
        apiKey: apiKey
      })

      const issues = await linearClient.issues();

      /* if(issues){
        for(let i = 0; i < issues.nodes.length; i++){
          const issue = issues.nodes[i];
          console.log('ID: ', issue.id);
          console.log('Issue ID: ', issue.identifier);
          console.log('Title: ', issue.title);
          console.log('Description', issue.description);
        }
      } */

      const targetIssue = await linearClient.issue(found[0].toUpperCase());
      console.log(targetIssue);
    }
    
    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
};

main();