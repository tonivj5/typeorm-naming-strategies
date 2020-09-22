# Typeorm naming strategies

This package provides a few (one, at the moment) useful custom naming strategies. It alterates the name of columns, relations and other fields in database.

For example, using the snake strategy, if you have a model like this:

```typescript
class User {
  @Column()
  createdAt;
}
```

In the DB the `createdAt` field will be `created_at`

## Naming strategies available

- Snake

## Installation

It's available as an [npm package](https://www.npmjs.com/package/typeorm-naming-strategies)

```sh
npm install typeorm-naming-strategies --save
```

Or using yarn

```sh
yarn add typeorm-naming-strategies
```

## Usage

```typescript
import { createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

await createConnection({
  ...
  namingStrategy: new SnakeNamingStrategy(), // Here you'r using the strategy!
});
```

Alternatively you can use it in combination with a `ormconfig.js`

```js
// Use require instead of import
const SnakeNamingStrategy = require("typeorm-naming-strategies").SnakeNamingStrategy

module.exports = {
  ...
  namingStrategy: new SnakeNamingStrategy(),
}
```
