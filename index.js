const { readdirSync, existsSync } = require('fs');
const { execSync } = require('child_process');
const { join } = require('path');
const { prompt } = require('enquirer');

const { SENBEI_TEMPLATES } = process.env;

function templateFiles() {
  if (!SENBEI_TEMPLATES) {
    throw new Error(
      'No template directory found. Set the `SENBEI_TEMPLATES` environment variable to the folder where senbei templates are stored.'
    );
  } else if (!existsSync(SENBEI_TEMPLATES)) {
    throw new Error(
      `${SENBEI_TEMPLATES} directory not found. Set the \`SENBEI_TEMPLATES\` environment variable to the folder where senbei templates are stored.`
    );
  }

  return readdirSync(SENBEI_TEMPLATES);
}

function getSnippetPrompt({ command, fields }) {
  const hasFields = !!fields;

  return hasFields
    ? {
        type: 'snippet',
        name: 'command',
        message: 'Fill out the fields in the following command',
        required: true,
        fields,
        template: command
      }
    : undefined;
}

async function main() {
  const choices = templateFiles();
  const selectTemplateFilePrompt = {
    type: 'select',
    name: 'templateFile',
    message: 'Choose a template',
    required: true,
    choices
  };

  const { templateFile } = await prompt(selectTemplateFilePrompt);

  try {
    const file = join(SENBEI_TEMPLATES, templateFile);
    // Hack: don't dynamically require files - find a better way
    const fileContents = require(file);

    let { command } = fileContents;
    const snippetPrompt = getSnippetPrompt(fileContents);
    const shouldRunPrompt = {
      type: 'confirm',
      name: 'shouldRun',
      initial: true,
      message: ({ answers: { command: { result } = {} } = {} }) => {
        const hasCommand = !!result;
        if (hasCommand) {
          command = result;
        }
        return `Command: \n\n${command}\n\nRun it?`;
      },
      required: true
    };
    const prompts = !!snippetPrompt
      ? [snippetPrompt, shouldRunPrompt]
      : shouldRunPrompt;
    const response = await prompt(prompts);
    const { shouldRun } = response;

    if (shouldRun) {
      const out = execSync(command);
      console.log(out.toString());
    }
  } catch (e) {
    console.error(e);
  }
}

main();
