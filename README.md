# typeorm-naming-strategies

Custom naming strategies for typeorm

# How to use

```typescript
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

await createConnection({
  ...
  namingStrategy: new SnakeNamingStrategy(),
});
```
