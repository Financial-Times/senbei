# 🍘 Senbei

Generate tasty command line snacks, using simple templates.

Senbei (せんべい) is Japanese for [rice cracker](https://translate.google.com/#view=home&op=translate&sl=en&tl=ja&text=rice%20cracker).

```shell
$ export SENBEI_TEMPLATES="/some/path/to/senbei-templates"
$ senbei
✔ Choose a template · echo.js
? Fill out the fields in the following command › 0% completed
 echo "<something here>"

# After typing something for `<something here>`

✔ Fill out the fields in the following command · 100% completed
✔ Do you want to run

echo "something"

? (Y/n) · true
something
```

Built on top of [enquirer](https://www.npmjs.com/package/enquirer).

## Usage

* Install `senbei`

      npm install -g senbei

* Set the `SENBEI_TEMPLATES` environment variable to be the folder where templates are stored

  The format of a template is

    ```javascript
    // echo.js

    // Add modifiable fields with `\${fieldName}`
    const command = `echo "\${something}"`;

    // `fieldName` can be added here with a message
    // If there are no modifiable fields, `fields` can be empty
    const fields = [
      {
        name: "something",
        message: "something here"
      }
    ];

    module.exports = { command, fields };
    ```

* Run: `senbei`

## Development

- Install [nvm](https://github.com/creationix/nvm)
- Use correct node version

        nvm use

- Install dependencies

        npm install

- To start the app

        npm start
