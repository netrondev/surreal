# DO NOT USE YET! UNDER DEVELOPMENT

https://jsr.io/@netron/surreal

# @netron/surreal

The plan is to provide a way to use surrealdb with type safety automatically.


```ts
import { NSurreal } from "@netron/surreal";

// connect like normal

const client = new NSurreal();

// like normal surrealdb.js
client.connect();
client.use();

// result should be typed automagically no matter the complexity of the query.
const result = await client.query("select * from yourtable;");

```