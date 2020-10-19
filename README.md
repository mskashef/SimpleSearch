# InvertedIndex

## Installation

Inside the root folder (in the folder which contains package.json) the following command:

```
npm install
```

## How to Run

To start the project, follow these steps

1. In the root directory run the following command:

   ```
   node server.js
   ```

   This wil start the backend server.

2. Go to the `front-end` folder and just open the `index.html` in your browser.

3. Type every query you want and press `search` button to search it among the documents.

## Code Descriptions

### Main parts of the project

Cause this project is written with web technologies, it has a fron-end and a back-end part and also it has a core written with js to calculate the user input queries.

- Front-end:

  - Technologies:
    `HTML`, `CSS`, `JavaScript`, `Fetch API`
  - Folder Structure:
    Front-end source code is inside of the `front-end` Directory in the root directory.
  - Index File: `root/front-end/index.html`

- Back-end Technologies:

  - Technologies:
    `Node.js`, `Express.js`
  - Folder Structure:
    Back-end source is inside of the root directory and it's a single javascript file.
  - Index File: `root/server.js`

- Calculation Core:

  - Technologies: `Node.js`
  - Folder Structure:
    All core code is inside of the root directory and every `.js` file except `server.js` in the root directory is a part of calculation core.
  - Index File: `root/app.js`

- Other Folders:
  - `root/files/disk`: is where the `Invertedindex` saves it's data (`data.csv`)
  - `root/files/store`: is where the source Documents are stored.

### Main Classes

The Calculation Core is made of 7 Main Classes:

1. Document

   It's a data structure to store some data from a document such as: `name`, `name`, `body`.

2. DocumentStore:

   It's a data structure to store many docs.
   Or better say, It's a map of document `id`s to documents.

3. PostingList

   It's a data structure to store many document `id` s in itself.

4. InvertedIndex

   It's a data structure to say that a token exists in which documents' body.

   better say, It's a map from `token text`s to `PostingList`s.

   And Also this data structure is going to save it's data on the disk to use it just when it is needed and the data is not allways on the RAM.

5. CSV

   This is a class to encode and decode CSV.

   It has two public and static methods:

   - encode

     which receives a Javascript array as it's single input parameter and returns the input parameter in the CSV file format.

   - decode

     which receives a strign in CSV format as it's input parameter and returns a Javascript Object.

6. Query

   This is a class which can get a query string as it's constructor parameter and it can run the query and calculate it's output according to given documents and returns an object which is instace of `PostingList` class.

7. Token

   This is a data structure to store a token's details and calculate it's some other details like `priority` and etc.
